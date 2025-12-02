export type CallStatus = 'scheduled' | 'active' | 'completed' | 'cancelled' | 'no_show';

export type CallType = 'video' | 'voice';

export interface VideoCall {
  id: string;
  channelName: string;
  tenantId: string;
  hostUserId: string;
  participantUserIds: string[];
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  status: CallStatus;
  type: CallType;
  title: string;
  description?: string;
  calendlyEventUri?: string;
  recordingUrl?: string;
  recordingSid?: string;
  durationMinutes?: number;
  billedMinutes?: number;
  isHd: boolean;
  screenShareEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CallUsage {
  id: string;
  tenantId: string;
  callId: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  billedMinutes: number;
  ratePerHour: number;
  totalCost: number;
  isPaid: boolean;
  createdAt: string;
}

export interface CallParticipant {
  id: string;
  callId: string;
  userId: string;
  joinedAt: string;
  leftAt?: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
}

export interface AgoraTokenResponse {
  token: string;
  channelName: string;
  uid: number;
  expiresAt: number;
}

export interface CreateCallRequest {
  title: string;
  description?: string;
  type: CallType;
  scheduledAt: string;
  participantUserIds: string[];
  isHd?: boolean;
  screenShareEnabled?: boolean;
  calendlyEventUri?: string;
}

export interface JoinCallRequest {
  callId: string;
  userId: string;
}

export interface CallRecordingConfig {
  callId: string;
  mode: 'cloud' | 'individual';
  vendorId?: number;
  region?: number;
  bucket?: string;
  accessKey?: string;
  secretKey?: string;
}

export const CALL_BILLING_RATE_PER_HOUR = 2.50;

export const calculateCallCost = (durationMinutes: number): number => {
  const billedMinutes = Math.ceil(durationMinutes);
  const hours = billedMinutes / 60;
  return Math.round(hours * CALL_BILLING_RATE_PER_HOUR * 100) / 100;
};

export const formatCallDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};
