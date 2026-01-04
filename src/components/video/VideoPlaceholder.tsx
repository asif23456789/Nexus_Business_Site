import React from 'react';
import {
  //  Mic, 
   MicOff, Monitor } from 'lucide-react';
import { Participant } from '../../types/video';

interface VideoPlaceholderProps {
  participant: Participant;
  isLarge: boolean;
  isScreenSharing: boolean;
}

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  participant,
  isLarge,
  isScreenSharing,
}) => {
  return (
    <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
      {/* Screen sharing indicator */}
      {isScreenSharing && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <Monitor className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <p className="text-white text-lg">Screen Sharing Active</p>
            <p className="text-gray-400 text-sm mt-2">{participant.name}</p>
          </div>
        </div>
      )}

      {/* Video off - show avatar */}
      {!participant.isVideoEnabled && !isScreenSharing && (
        <div className="flex flex-col items-center justify-center">
          <div
            className={`rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
              isLarge ? 'w-32 h-32' : 'w-20 h-20'
            }`}
          >
            <span
              className={`text-white font-bold ${
                isLarge ? 'text-4xl' : 'text-2xl'
              }`}
            >
              {participant.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-white mt-4 text-center">{participant.name}</p>
        </div>
      )}

      {/* Video on - show mock video feed */}
      {participant.isVideoEnabled && !isScreenSharing && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
          {/* Mock video effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-75"></div>
          </div>
          
          {/* Center avatar for mock video */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
                isLarge ? 'w-32 h-32' : 'w-20 h-20'
              }`}
            >
              <span
                className={`text-white font-bold ${
                  isLarge ? 'text-4xl' : 'text-2xl'
                }`}
              >
                {participant.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Participant info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium truncate">
              {participant.name}
            </span>
            {participant.isSpeaking && (
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-green-500 rounded animate-pulse"></div>
                <div className="w-1 h-3 bg-green-500 rounded animate-pulse delay-75"></div>
                <div className="w-1 h-5 bg-green-500 rounded animate-pulse delay-150"></div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {!participant.isAudioEnabled && (
              <div className="bg-red-500 p-1 rounded">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="absolute top-2 right-2">
        <span className={`text-xs px-2 py-1 rounded-full ${
          participant.role === 'investor'
            ? 'bg-blue-500 text-white'
            : 'bg-purple-500 text-white'
        }`}>
          {participant.role === 'investor' ? 'Investor' : 'Entrepreneur'}
        </span>
      </div>
    </div>
  );
};

export default VideoPlaceholder;