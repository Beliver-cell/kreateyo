import { useState, useCallback, useEffect, useRef } from 'react';
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { agoraService, AgoraConfig, LocalTracks, RemoteUser } from '@/services/agoraService';

interface UseAgoraOptions {
  onUserJoined?: (user: IAgoraRTCRemoteUser) => void;
  onUserLeft?: (user: IAgoraRTCRemoteUser) => void;
  onError?: (error: Error) => void;
}

interface UseAgoraReturn {
  isJoined: boolean;
  isConnecting: boolean;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
  localTracks: LocalTracks | null;
  remoteUsers: RemoteUser[];
  error: Error | null;
  join: (config: AgoraConfig, enableHD?: boolean) => Promise<void>;
  leave: () => Promise<void>;
  toggleMuteAudio: () => Promise<void>;
  toggleMuteVideo: () => Promise<void>;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => Promise<void>;
}

export function useAgora(options: UseAgoraOptions = {}): UseAgoraReturn {
  const [isJoined, setIsJoined] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localTracks, setLocalTracks] = useState<LocalTracks | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const updateRemoteUser = useCallback((user: IAgoraRTCRemoteUser, action: 'add' | 'remove' | 'update', mediaType?: 'video' | 'audio') => {
    setRemoteUsers(prev => {
      if (action === 'remove') {
        return prev.filter(u => u.uid !== user.uid);
      }
      
      const existingIndex = prev.findIndex(u => u.uid === user.uid);
      const remoteUser: RemoteUser = {
        uid: user.uid,
        videoTrack: user.videoTrack,
        audioTrack: user.audioTrack,
        hasVideo: !!user.videoTrack,
        hasAudio: !!user.audioTrack,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = remoteUser;
        return updated;
      }
      
      return [...prev, remoteUser];
    });
  }, []);

  const join = useCallback(async (config: AgoraConfig, enableHD: boolean = true) => {
    setIsConnecting(true);
    setError(null);

    try {
      await agoraService.initialize(config, {
        onUserJoined: (user) => {
          updateRemoteUser(user, 'add');
          optionsRef.current.onUserJoined?.(user);
        },
        onUserLeft: (user) => {
          updateRemoteUser(user, 'remove');
          optionsRef.current.onUserLeft?.(user);
        },
        onUserPublished: (user, mediaType) => {
          updateRemoteUser(user, 'update', mediaType);
        },
        onUserUnpublished: (user, mediaType) => {
          updateRemoteUser(user, 'update', mediaType);
        },
        onError: (err) => {
          setError(err);
          optionsRef.current.onError?.(err);
        },
      });

      const tracks = await agoraService.createLocalTracks(enableHD);
      setLocalTracks(tracks);

      await agoraService.join();
      await agoraService.publishTracks();

      setIsJoined(true);
      setIsAudioMuted(false);
      setIsVideoMuted(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to join call');
      setError(error);
      optionsRef.current.onError?.(error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [updateRemoteUser]);

  const leave = useCallback(async () => {
    try {
      await agoraService.leave();
      setIsJoined(false);
      setLocalTracks(null);
      setRemoteUsers([]);
      setIsAudioMuted(false);
      setIsVideoMuted(false);
      setIsScreenSharing(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to leave call');
      setError(error);
    }
  }, []);

  const toggleMuteAudio = useCallback(async () => {
    try {
      const muted = await agoraService.toggleMuteAudio();
      setIsAudioMuted(muted);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to toggle audio');
      setError(error);
    }
  }, []);

  const toggleMuteVideo = useCallback(async () => {
    try {
      const muted = await agoraService.toggleMuteVideo();
      setIsVideoMuted(muted);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to toggle video');
      setError(error);
    }
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      await agoraService.startScreenShare();
      setIsScreenSharing(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start screen share');
      setError(error);
    }
  }, []);

  const stopScreenShare = useCallback(async () => {
    try {
      await agoraService.stopScreenShare();
      setIsScreenSharing(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to stop screen share');
      setError(error);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (isJoined) {
        agoraService.leave();
      }
    };
  }, [isJoined]);

  return {
    isJoined,
    isConnecting,
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    localTracks,
    remoteUsers,
    error,
    join,
    leave,
    toggleMuteAudio,
    toggleMuteVideo,
    startScreenShare,
    stopScreenShare,
  };
}
