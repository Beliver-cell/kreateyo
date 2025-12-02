import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalVideoTrack,
  ILocalAudioTrack,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng';

export interface AgoraConfig {
  appId: string;
  channel: string;
  token: string;
  uid: number | string;
}

export interface LocalTracks {
  videoTrack: ICameraVideoTrack | null;
  audioTrack: IMicrophoneAudioTrack | null;
  screenTrack: ILocalVideoTrack | null;
}

export interface RemoteUser {
  uid: number | string;
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
  hasVideo: boolean;
  hasAudio: boolean;
}

export type AgoraEventCallback = {
  onUserJoined?: (user: IAgoraRTCRemoteUser) => void;
  onUserLeft?: (user: IAgoraRTCRemoteUser, reason: string) => void;
  onUserPublished?: (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => void;
  onUserUnpublished?: (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => void;
  onConnectionStateChanged?: (curState: string, prevState: string, reason?: string) => void;
  onTokenPrivilegeWillExpire?: () => void;
  onError?: (error: Error) => void;
};

class AgoraService {
  private client: IAgoraRTCClient | null = null;
  private localTracks: LocalTracks = {
    videoTrack: null,
    audioTrack: null,
    screenTrack: null,
  };
  private isJoined: boolean = false;
  private isScreenSharing: boolean = false;
  private config: AgoraConfig | null = null;
  private eventCallbacks: AgoraEventCallback = {};

  constructor() {
    AgoraRTC.setLogLevel(3);
  }

  async initialize(config: AgoraConfig, callbacks?: AgoraEventCallback): Promise<void> {
    this.config = config;
    this.eventCallbacks = callbacks || {};

    this.client = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'vp8',
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.client) return;

    this.client.on('user-joined', (user) => {
      console.log('User joined:', user.uid);
      this.eventCallbacks.onUserJoined?.(user);
    });

    this.client.on('user-left', (user, reason) => {
      console.log('User left:', user.uid, reason);
      this.eventCallbacks.onUserLeft?.(user, reason);
    });

    this.client.on('user-published', async (user, mediaType) => {
      console.log('User published:', user.uid, mediaType);
      await this.client?.subscribe(user, mediaType);
      if (mediaType === 'video' || mediaType === 'audio') {
        this.eventCallbacks.onUserPublished?.(user, mediaType);
      }
    });

    this.client.on('user-unpublished', (user, mediaType) => {
      console.log('User unpublished:', user.uid, mediaType);
      if (mediaType === 'video' || mediaType === 'audio') {
        this.eventCallbacks.onUserUnpublished?.(user, mediaType);
      }
    });

    this.client.on('connection-state-change', (curState, prevState, reason) => {
      console.log('Connection state:', curState, 'from', prevState, reason);
      this.eventCallbacks.onConnectionStateChanged?.(curState, prevState, reason);
    });

    this.client.on('token-privilege-will-expire', async () => {
      console.log('Token will expire soon');
      this.eventCallbacks.onTokenPrivilegeWillExpire?.();
    });
  }

  async join(): Promise<void> {
    if (!this.client || !this.config) {
      throw new Error('Agora client not initialized');
    }

    if (this.isJoined) {
      console.log('Already joined channel');
      return;
    }

    try {
      await this.client.join(
        this.config.appId,
        this.config.channel,
        this.config.token,
        this.config.uid
      );
      this.isJoined = true;
      console.log('Joined channel successfully');
    } catch (error) {
      console.error('Failed to join channel:', error);
      throw error;
    }
  }

  async createLocalTracks(enableHD: boolean = true): Promise<LocalTracks> {
    try {
      const videoConfig = enableHD
        ? {
            encoderConfig: {
              width: 1280,
              height: 720,
              frameRate: 30,
              bitrateMax: 2500,
            },
          }
        : {};

      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(videoConfig),
      ]);

      this.localTracks.audioTrack = audioTrack;
      this.localTracks.videoTrack = videoTrack;

      return this.localTracks;
    } catch (error) {
      console.error('Failed to create local tracks:', error);
      throw error;
    }
  }

  async publishTracks(): Promise<void> {
    if (!this.client || !this.isJoined) {
      throw new Error('Must join channel before publishing');
    }

    const tracksToPublish = [];
    
    if (this.localTracks.audioTrack) {
      tracksToPublish.push(this.localTracks.audioTrack);
    }
    
    if (this.isScreenSharing && this.localTracks.screenTrack) {
      tracksToPublish.push(this.localTracks.screenTrack);
    } else if (this.localTracks.videoTrack) {
      tracksToPublish.push(this.localTracks.videoTrack);
    }

    if (tracksToPublish.length > 0) {
      await this.client.publish(tracksToPublish);
      console.log('Published local tracks');
    }
  }

  async unpublishTracks(): Promise<void> {
    if (!this.client) return;

    const tracksToUnpublish = [];
    
    if (this.localTracks.audioTrack) {
      tracksToUnpublish.push(this.localTracks.audioTrack);
    }
    
    if (this.localTracks.videoTrack) {
      tracksToUnpublish.push(this.localTracks.videoTrack);
    }
    
    if (this.localTracks.screenTrack) {
      tracksToUnpublish.push(this.localTracks.screenTrack);
    }

    if (tracksToUnpublish.length > 0) {
      await this.client.unpublish(tracksToUnpublish);
      console.log('Unpublished local tracks');
    }
  }

  async toggleMuteAudio(): Promise<boolean> {
    if (!this.localTracks.audioTrack) return false;
    
    const isMuted = this.localTracks.audioTrack.muted;
    await this.localTracks.audioTrack.setMuted(!isMuted);
    return !isMuted;
  }

  async toggleMuteVideo(): Promise<boolean> {
    if (!this.localTracks.videoTrack) return false;
    
    const isMuted = this.localTracks.videoTrack.muted;
    await this.localTracks.videoTrack.setMuted(!isMuted);
    return !isMuted;
  }

  async setAudioMuted(muted: boolean): Promise<void> {
    if (this.localTracks.audioTrack) {
      await this.localTracks.audioTrack.setMuted(muted);
    }
  }

  async setVideoMuted(muted: boolean): Promise<void> {
    if (this.localTracks.videoTrack) {
      await this.localTracks.videoTrack.setMuted(muted);
    }
  }

  async startScreenShare(): Promise<ILocalVideoTrack | null> {
    if (!this.client || !this.isJoined) {
      throw new Error('Must join channel before screen sharing');
    }

    try {
      if (this.localTracks.videoTrack) {
        await this.client.unpublish(this.localTracks.videoTrack);
      }

      const screenTrack = await AgoraRTC.createScreenVideoTrack(
        {
          encoderConfig: {
            width: 1920,
            height: 1080,
            frameRate: 15,
            bitrateMax: 3000,
          },
        },
        'disable'
      );

      if (Array.isArray(screenTrack)) {
        this.localTracks.screenTrack = screenTrack[0];
      } else {
        this.localTracks.screenTrack = screenTrack;
      }

      await this.client.publish(this.localTracks.screenTrack);
      this.isScreenSharing = true;

      this.localTracks.screenTrack.on('track-ended', () => {
        this.stopScreenShare();
      });

      return this.localTracks.screenTrack;
    } catch (error) {
      console.error('Failed to start screen share:', error);
      if (this.localTracks.videoTrack) {
        await this.client.publish(this.localTracks.videoTrack);
      }
      throw error;
    }
  }

  async stopScreenShare(): Promise<void> {
    if (!this.client || !this.localTracks.screenTrack) return;

    try {
      await this.client.unpublish(this.localTracks.screenTrack);
      this.localTracks.screenTrack.close();
      this.localTracks.screenTrack = null;
      this.isScreenSharing = false;

      if (this.localTracks.videoTrack) {
        await this.client.publish(this.localTracks.videoTrack);
      }
    } catch (error) {
      console.error('Failed to stop screen share:', error);
    }
  }

  async leave(): Promise<void> {
    if (!this.client) return;

    try {
      await this.unpublishTracks();

      if (this.localTracks.audioTrack) {
        this.localTracks.audioTrack.close();
        this.localTracks.audioTrack = null;
      }

      if (this.localTracks.videoTrack) {
        this.localTracks.videoTrack.close();
        this.localTracks.videoTrack = null;
      }

      if (this.localTracks.screenTrack) {
        this.localTracks.screenTrack.close();
        this.localTracks.screenTrack = null;
      }

      await this.client.leave();
      this.isJoined = false;
      this.isScreenSharing = false;
      console.log('Left channel successfully');
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  }

  async renewToken(token: string): Promise<void> {
    if (!this.client) return;
    await this.client.renewToken(token);
    if (this.config) {
      this.config.token = token;
    }
  }

  getLocalTracks(): LocalTracks {
    return this.localTracks;
  }

  isConnected(): boolean {
    return this.isJoined;
  }

  isScreenSharingActive(): boolean {
    return this.isScreenSharing;
  }

  getRemoteUsers(): IAgoraRTCRemoteUser[] {
    return this.client?.remoteUsers || [];
  }

  destroy(): void {
    this.leave();
    this.client = null;
    this.config = null;
    this.eventCallbacks = {};
  }
}

export const agoraService = new AgoraService();
export default AgoraService;
