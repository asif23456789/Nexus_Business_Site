export interface Participant {
  id: string;
  name: string;
  role: 'entrepreneur' | 'investor';
  avatarUrl?: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isSpeaking?: boolean;
}

export interface CallSettings {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
}

export interface CallState {
  callId: string;
  isActive: boolean;
  startTime: Date | null;
  duration: number; // in seconds
  participants: Participant[];
  localSettings: CallSettings;
  isConnecting: boolean;
  error: string | null;
}

export interface VideoCallProps {
  meetingId?: string;
  participantName?: string;
  participantRole?: 'entrepreneur' | 'investor';
}

export type CallAction =
  | { type: 'START_CALL'; payload: { callId: string } }
  | { type: 'END_CALL' }
  | { type: 'TOGGLE_AUDIO' }
  | { type: 'TOGGLE_VIDEO' }
  | { type: 'TOGGLE_SCREEN_SHARE' }
  | { type: 'ADD_PARTICIPANT'; payload: Participant }
  | { type: 'REMOVE_PARTICIPANT'; payload: string }
  | { type: 'UPDATE_DURATION'; payload: number }
  | { type: 'SET_ERROR'; payload: string };