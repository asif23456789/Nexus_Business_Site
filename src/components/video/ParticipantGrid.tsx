import React from 'react';
import { Participant } from '../../types/video';
import VideoPlaceholder from './VideoPlaceholder';

interface ParticipantGridProps {
  participants: Participant[];
  isScreenSharing: boolean;
}

const ParticipantGrid: React.FC<ParticipantGridProps> = ({ participants, isScreenSharing }) => {
  // If someone is screen sharing, show different layout
  if (isScreenSharing) {
    return (
      <div className="h-full flex gap-4">
        {/* Main screen share area */}
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
          
          <VideoPlaceholder
            participant={participants[0]}
            isLarge={true}
            isScreenSharing={true}
          />
        </div>
        
        {/* Side participants */}
        <div className="w-64 space-y-4 overflow-y-auto">
          {participants.map((participant) => (
            <div key={participant.id} className="bg-gray-800 rounded-lg overflow-hidden aspect-video">
              <VideoPlaceholder
                participant={participant}
                isLarge={false}
                isScreenSharing={false}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Regular grid layout
  const getGridClass = () => {
    const count = participants.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-3';
    return 'grid-cols-3';
  };

  return (
    <div className={`h-full grid ${getGridClass()} gap-4`}>
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="bg-gray-800 rounded-lg overflow-hidden relative"
        >
          <VideoPlaceholder
            participant={participant}
            isLarge={participants.length <= 2}
            isScreenSharing={false}
          />
        </div>
      ))}
    </div>
  );
};

export default ParticipantGrid;