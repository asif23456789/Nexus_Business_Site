import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  MicOff, 
  VideoOff, 
  Users, MessageSquare, Settings, X, Video as VideoIcon, Mic } from 'lucide-react';
import { CallState, CallAction, Participant } from '../../types/video';
import { useAuth } from '../../context/AuthContext';
import ParticipantGrid from '../../components/video/ParticipantGrid';
import VideoControls from '../../components/video/VideoControls';

const initialState: CallState = {
  callId: '',
  isActive: false,
  startTime: null,
  duration: 0,
  participants: [],
  localSettings: {
    audioEnabled: true,
    videoEnabled: true,
    screenSharing: false,
  },
  isConnecting: false,
  error: null,
};

function callReducer(state: CallState, action: CallAction): CallState {
  switch (action.type) {
    case 'START_CALL':
      return {
        ...state,
        callId: action.payload.callId,
        isActive: true,
        startTime: new Date(),
        isConnecting: false,
      };
    case 'END_CALL':
      return {
        ...initialState,
      };
    case 'TOGGLE_AUDIO':
      return {
        ...state,
        localSettings: {
          ...state.localSettings,
          audioEnabled: !state.localSettings.audioEnabled,
        },
      };
    case 'TOGGLE_VIDEO':
      return {
        ...state,
        localSettings: {
          ...state.localSettings,
          videoEnabled: !state.localSettings.videoEnabled,
        },
      };
    case 'TOGGLE_SCREEN_SHARE':
      return {
        ...state,
        localSettings: {
          ...state.localSettings,
          screenSharing: !state.localSettings.screenSharing,
        },
      };
    case 'ADD_PARTICIPANT':
      return {
        ...state,
        participants: [...state.participants, action.payload],
      };
    case 'REMOVE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.filter((p) => p.id !== action.payload),
      };
    case 'UPDATE_DURATION':
      return {
        ...state,
        duration: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isConnecting: false,
      };
    default:
      return state;
  }
}

const VideoCallPage: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(callReducer, initialState);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    // Simulate starting call
    if (user && meetingId) {
      setTimeout(() => {
        dispatch({ type: 'START_CALL', payload: { callId: meetingId } });
        
        // Add mock participants
        const mockParticipants: Participant[] = [
          {
            id: user.id,
            name: user.name,
            role: user.role,
            avatarUrl: user.avatarUrl,
            isAudioEnabled: true,
            isVideoEnabled: true,
            isScreenSharing: false,
          },
          {
            id: 'remote-1',
            name: 'Sarah Investor',
            role: 'investor',
            isAudioEnabled: true,
            isVideoEnabled: true,
            isScreenSharing: false,
          },
        ];
        
        mockParticipants.forEach((participant) => {
          dispatch({ type: 'ADD_PARTICIPANT', payload: participant });
        });
      }, 1000);
    }
  }, [user, meetingId]);

  // Update call duration
  useEffect(() => {
    if (state.isActive && state.startTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - state.startTime!.getTime()) / 1000);
        dispatch({ type: 'UPDATE_DURATION', payload: duration });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [state.isActive, state.startTime]);

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    dispatch({ type: 'END_CALL' });
    navigate(-1);
  };

  const handleToggleAudio = () => {
    dispatch({ type: 'TOGGLE_AUDIO' });
  };

  const handleToggleVideo = () => {
    dispatch({ type: 'TOGGLE_VIDEO' });
  };

  const handleToggleScreenShare = () => {
    dispatch({ type: 'TOGGLE_SCREEN_SHARE' });
  };

  if (!state.isActive && !state.isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-ping"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <VideoIcon className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-white text-xl font-semibold">Connecting to call...</p>
          <p className="text-purple-300 text-sm">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/90 to-gray-800/90 backdrop-blur-lg border-b border-gray-700/50 px-6 py-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <VideoIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Meeting: {meetingId}</h1>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                    <span className="text-sm text-gray-300 font-medium">{formatDuration(state.duration)}</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm text-gray-400">{state.participants.length} participants</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                showParticipants 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                showChat 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-6">
        <ParticipantGrid 
          participants={state.participants}
          isScreenSharing={state.localSettings.screenSharing}
        />
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-r from-slate-800/90 to-gray-800/90 backdrop-blur-lg border-t border-gray-700/50 px-6 py-5 shadow-2xl">
        <VideoControls
          audioEnabled={state.localSettings.audioEnabled}
          videoEnabled={state.localSettings.videoEnabled}
          screenSharing={state.localSettings.screenSharing}
          onToggleAudio={handleToggleAudio}
          onToggleVideo={handleToggleVideo}
          onToggleScreenShare={handleToggleScreenShare}
          onEndCall={handleEndCall}
        />
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="fixed right-0 top-0 h-full w-80 sm:w-96 bg-gradient-to-b from-slate-800 to-gray-900 shadow-2xl z-50 border-l border-gray-700/50 backdrop-blur-xl animate-in slide-in-from-right duration-300">
          <div className="p-5 border-b border-gray-700/50 flex items-center justify-between bg-gradient-to-r from-slate-800/90 to-gray-800/90">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg">Chat</h3>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-gray-400 text-sm">Chat feature coming soon...</p>
          </div>
        </div>
      )}

      {/* Participants Sidebar */}
      {showParticipants && (
        <div className="fixed right-0 top-0 h-full w-80 sm:w-96 bg-gradient-to-b from-slate-800 to-gray-900 shadow-2xl z-50 border-l border-gray-700/50 backdrop-blur-xl animate-in slide-in-from-right duration-300">
          <div className="p-5 border-b border-gray-700/50 flex items-center justify-between bg-gradient-to-r from-slate-800/90 to-gray-800/90">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg">
                Participants 
                <span className="ml-2 text-sm text-gray-400">({state.participants.length})</span>
              </h3>
            </div>
            <button
              onClick={() => setShowParticipants(false)}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 space-y-2">
            {state.participants.map((participant) => (
              <div 
                key={participant.id} 
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-200 group border border-transparent hover:border-gray-700/50"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-white text-sm font-bold">
                    {participant.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{participant.name}</p>
                  <p className="text-gray-400 text-xs capitalize truncate">{participant.role}</p>
                </div>
                <div className="flex space-x-1.5">
                  {participant.isAudioEnabled ? (
                    <div className="p-1.5 bg-green-500/20 rounded-lg">
                      <Mic className="w-4 h-4 text-green-400" />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-red-500/20 rounded-lg">
                      <MicOff className="w-4 h-4 text-red-400" />
                    </div>
                  )}
                  {participant.isVideoEnabled ? (
                    <div className="p-1.5 bg-green-500/20 rounded-lg">
                      <VideoIcon className="w-4 h-4 text-green-400" />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-red-500/20 rounded-lg">
                      <VideoOff className="w-4 h-4 text-red-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallPage;