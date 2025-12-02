import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAgora } from '@/hooks/useAgora';
import { AgoraConfig, RemoteUser } from '@/services/agoraService';
import { VideoCall, formatCallDuration } from '@/types/calls';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MonitorUp,
  MonitorOff,
  Users,
  Clock,
  Settings,
  Maximize,
  Minimize,
} from 'lucide-react';

interface VideoCallRoomProps {
  call: VideoCall;
  agoraConfig: AgoraConfig;
  onLeave: () => void;
  onCallEnded?: (durationMinutes: number) => void;
}

export function VideoCallRoom({ call, agoraConfig, onLeave, onCallEnded }: VideoCallRoomProps) {
  const localVideoRef = useRef<HTMLDivElement>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const callStartRef = useRef<Date>(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useAgora({
    onUserJoined: (user) => {
      console.log('Remote user joined:', user.uid);
    },
    onUserLeft: (user) => {
      console.log('Remote user left:', user.uid);
    },
    onError: (err) => {
      console.error('Agora error:', err);
    },
  });

  useEffect(() => {
    const initCall = async () => {
      try {
        await join(agoraConfig, call.isHd);
        callStartRef.current = new Date();
      } catch (err) {
        console.error('Failed to join call:', err);
      }
    };

    initCall();

    return () => {
      const duration = Math.ceil((new Date().getTime() - callStartRef.current.getTime()) / 60000);
      onCallEnded?.(duration);
    };
  }, []);

  useEffect(() => {
    if (localTracks?.videoTrack && localVideoRef.current) {
      localTracks.videoTrack.play(localVideoRef.current);
    }
  }, [localTracks?.videoTrack]);

  useEffect(() => {
    if (!isJoined) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - callStartRef.current.getTime()) / 1000);
      setCallDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isJoined]);

  const handleLeave = async () => {
    const duration = Math.ceil((new Date().getTime() - callStartRef.current.getTime()) / 60000);
    await leave();
    onCallEnded?.(duration);
    onLeave();
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-white text-lg">Connecting to call...</p>
          <p className="text-gray-400 text-sm mt-2">{call.title}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <Card className="p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-500 mb-2">Connection Error</h3>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <div className="flex gap-2">
            <Button onClick={() => join(agoraConfig, call.isHd)}>Retry</Button>
            <Button variant="outline" onClick={onLeave}>Leave</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-gray-900"
      data-testid="video-call-room"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <h2 className="text-white font-semibold">{call.title}</h2>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            Live
          </Badge>
          {call.isHd && (
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              HD
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatDuration(callDuration)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="h-4 w-4" />
            <span>{remoteUsers.length + 1}</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-white"
            data-testid="button-fullscreen"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 grid gap-4" style={{
        gridTemplateColumns: remoteUsers.length === 0 
          ? '1fr' 
          : remoteUsers.length === 1 
            ? '1fr 1fr' 
            : `repeat(${Math.min(remoteUsers.length + 1, 3)}, 1fr)`,
      }}>
        <div 
          ref={localVideoRef}
          className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video"
          data-testid="local-video"
        >
          {isVideoMuted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">You</AvatarFallback>
              </Avatar>
            </div>
          )}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">You</span>
            {isAudioMuted && <MicOff className="h-4 w-4 text-red-400" />}
          </div>
          {isScreenSharing && (
            <Badge className="absolute top-3 left-3 bg-blue-500">
              Screen Sharing
            </Badge>
          )}
        </div>

        {remoteUsers.map((user) => (
          <RemoteUserVideo key={user.uid} user={user} />
        ))}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-center gap-4">
          <Button
            size="icon"
            variant={isAudioMuted ? 'destructive' : 'secondary'}
            className="h-12 w-12 rounded-full"
            onClick={toggleMuteAudio}
            data-testid="button-toggle-audio"
          >
            {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Button
            size="icon"
            variant={isVideoMuted ? 'destructive' : 'secondary'}
            className="h-12 w-12 rounded-full"
            onClick={toggleMuteVideo}
            data-testid="button-toggle-video"
          >
            {isVideoMuted ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>

          {call.screenShareEnabled && (
            <Button
              size="icon"
              variant={isScreenSharing ? 'default' : 'secondary'}
              className="h-12 w-12 rounded-full"
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
              data-testid="button-screen-share"
            >
              {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <MonitorUp className="h-5 w-5" />}
            </Button>
          )}

          <Button
            size="icon"
            variant="destructive"
            className="h-14 w-14 rounded-full"
            onClick={handleLeave}
            data-testid="button-end-call"
          >
            <Phone className="h-6 w-6 rotate-[135deg]" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function RemoteUserVideo({ user }: { user: RemoteUser }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user.videoTrack && containerRef.current) {
      user.videoTrack.play(containerRef.current);
    }
  }, [user.videoTrack]);

  useEffect(() => {
    if (user.audioTrack) {
      user.audioTrack.play();
    }
  }, [user.audioTrack]);

  return (
    <div
      ref={containerRef}
      className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video"
      data-testid={`remote-video-${user.uid}`}
    >
      {!user.hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-2xl">
              {String(user.uid).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">
          User {user.uid}
        </span>
        {!user.hasAudio && <MicOff className="h-4 w-4 text-red-400" />}
      </div>
    </div>
  );
}
