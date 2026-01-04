import React from 'react';
import { Phone } from 'lucide-react';
import { CallState } from '../../types/video';
import ParticipantGrid from './ParticipantGrid';
import VideoControls from './VideoControls';

interface VideoCallInterfaceProps {
  state: CallState;
  onStartCall: () => void;
  onEndCall: () => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
}

const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  state,
  onStartCall,
  onEndCall,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
}) => {
  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  if (!state.isActive) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Ready to Connect</h1>
          <p className="text-gray-300 mb-8 max-w-md">
            Start a video call with your team. Click the button below to begin.
          </p>
          <button
            onClick={onStartCall}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <Phone className="w-5 h-5" />
            <span>Start Call</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Video Call
            </h1>
            <span className="text-sm text-gray-300">
              {state.participants.length + 1} participant{state.participants.length !== 0 ? 's' : ''}
            </span>
          </div>
          <div className="text-lg font-mono text-gray-300">
            {formatDuration(state.duration)}
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex flex-col gap-4 p-4 sm:p-6 overflow-hidden">
        {state.participants.length > 0 ? (
          <ParticipantGrid
            participants={state.participants}
            isScreenSharing={state.localSettings.screenSharing}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-gray-400">?</span>
              </div>
              <p className="text-gray-300 text-sm">Waiting for participants to join...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left info - hidden on small screens */}
          <div className="hidden sm:flex items-center space-x-2 text-gray-300 text-sm">
            {state.localSettings.videoEnabled ? (
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            ) : (
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            )}
            <span>
              {state.localSettings.videoEnabled ? 'Camera On' : 'Camera Off'}
            </span>
          </div>

          {/* Center controls */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap order-2 sm:order-none">
            <VideoControls
              audioEnabled={state.localSettings.audioEnabled}
              videoEnabled={state.localSettings.videoEnabled}
              screenSharing={state.localSettings.screenSharing}
              onToggleAudio={onToggleAudio}
              onToggleVideo={onToggleVideo}
              onToggleScreenShare={onToggleScreenShare}
              onEndCall={onEndCall}
            />
          </div>

          {/* Right info - hidden on small screens */}
          <div className="hidden sm:flex items-center space-x-2 text-gray-300 text-sm">
            {state.localSettings.audioEnabled ? (
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            ) : (
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            )}
            <span>
              {state.localSettings.audioEnabled ? 'Mic On' : 'Mic Off'}
            </span>
          </div>
        </div>

        {/* Mobile info - shown only on small screens */}
        <div className="sm:hidden flex items-center justify-center space-x-6 text-gray-300 text-xs mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center space-x-1">
            {state.localSettings.videoEnabled ? (
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            ) : (
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            )}
            <span>Camera</span>
          </div>
          <div className="flex items-center space-x-1">
            {state.localSettings.audioEnabled ? (
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            ) : (
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            )}
            <span>Mic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallInterface;
