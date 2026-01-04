import React from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, PhoneOff, MoreVertical } from 'lucide-react';

interface VideoControlsProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  audioEnabled,
  videoEnabled,
  screenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Audio Toggle */}
      <button
        onClick={onToggleAudio}
        className={`p-4 rounded-full transition-colors ${
          audioEnabled
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
        title={audioEnabled ? 'Mute' : 'Unmute'}
      >
        {audioEnabled ? (
          <Mic className="w-6 h-6" />
        ) : (
          <MicOff className="w-6 h-6" />
        )}
      </button>

      {/* Video Toggle */}
      <button
        onClick={onToggleVideo}
        className={`p-4 rounded-full transition-colors ${
          videoEnabled
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
        title={videoEnabled ? 'Stop Video' : 'Start Video'}
      >
        {videoEnabled ? (
          <Video className="w-6 h-6" />
        ) : (
          <VideoOff className="w-6 h-6" />
        )}
      </button>

      {/* Screen Share Toggle */}
      <button
        onClick={onToggleScreenShare}
        className={`p-4 rounded-full transition-colors ${
          screenSharing
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
        title={screenSharing ? 'Stop Sharing' : 'Share Screen'}
      >
        {screenSharing ? (
          <MonitorOff className="w-6 h-6" />
        ) : (
          <Monitor className="w-6 h-6" />
        )}
      </button>

      {/* End Call */}
      <button
        onClick={onEndCall}
        className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
        title="End Call"
      >
        <PhoneOff className="w-6 h-6" />
      </button>

      {/* More Options */}
      <button
        className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
        title="More Options"
      >
        <MoreVertical className="w-6 h-6" />
      </button>
    </div>
  );
};

export default VideoControls;