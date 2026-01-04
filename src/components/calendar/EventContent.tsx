import { Video, Phone, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const EventContent = (eventInfo: any) => {
  const event = eventInfo.event;
  const type = event.extendedProps.type || event._def.extendedProps.type;
  const status = event.extendedProps.status || event._def.extendedProps.status;
  const meetingType = event.extendedProps.meetingType || event._def.extendedProps.meetingType;

  const getIcon = () => {
    if (type === 'availability') return null;
    
    switch (meetingType) {
      case 'video': return <Video className="w-3 h-3 mr-1" />;
      case 'phone': return <Phone className="w-3 h-3 mr-1" />;
      case 'in-person': return <MapPin className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'declined': return <XCircle className="w-3 h-3 text-red-500" />;
      case 'pending': return <AlertCircle className="w-3 h-3 text-yellow-500" />;
      default: return null;
    }
  };

  const getEventStyle = () => {
    const baseClasses = "p-1 rounded text-xs font-medium truncate";
    
    if (type === 'availability') {
      return `${baseClasses} bg-green-100 text-green-800 border-l-2 border-green-500`;
    }
    
    switch (status) {
      case 'confirmed': return `${baseClasses} bg-blue-100 text-blue-800 border-l-2 border-blue-500`;
      case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-800 border-l-2 border-yellow-500`;
      case 'declined': return `${baseClasses} bg-red-100 text-red-800 border-l-2 border-red-500`;
      default: return `${baseClasses} bg-gray-100 text-gray-800 border-l-2 border-gray-500`;
    }
  };

  return (
    <div className={getEventStyle()}>
      <div className="flex items-center">
        {getIcon()}
        <span className="truncate">{event.title}</span>
        {getStatusIcon() && (
          <span className="ml-1">
            {getStatusIcon()}
          </span>
        )}
      </div>
      {eventInfo.timeText && (
        <div className="flex items-center mt-0.5 text-xs opacity-75">
          <Clock className="w-2 h-2 mr-1" />
          {eventInfo.timeText}
        </div>
      )}
    </div>
  );
};

export default EventContent;