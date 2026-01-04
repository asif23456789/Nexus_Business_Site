import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, Phone, MapPin, Users, X, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { CalendarEvent } from '../../types/calendar';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UpcomingMeetings: React.FC = () => {
  const [meetings, setMeetings] = useState<CalendarEvent[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<CalendarEvent | null>(null);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const loadMeetings = () => {
    const events = window.calendarEvents || [];
    const allMeetings = events
      .filter(event => event.type === 'meeting' && (event.status === 'confirmed' || event.status === 'pending'))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    setMeetings(allMeetings);
  };

  useEffect(() => {
    loadMeetings();

    // Listen for calendar updates
    const handleCalendarUpdate = () => {
      loadMeetings();
    };

    window.addEventListener('calendarEventsUpdated', handleCalendarUpdate);
    return () => window.removeEventListener('calendarEventsUpdated', handleCalendarUpdate);
  }, []);

  const handleRemoveMeeting = (meetingId: string) => {
    if (confirm('Are you sure you want to remove this meeting?')) {
      const updatedEvents = (window.calendarEvents || []).filter(e => e.id !== meetingId);
      window.calendarEvents = updatedEvents;
      window.dispatchEvent(new CustomEvent('calendarEventsUpdated', { detail: updatedEvents }));
      setMeetings(meetings.filter(m => m.id !== meetingId));
      setSelectedMeeting(null);
      toast.success('Meeting removed successfully!');
    }
  };

  const getTimeUntilMeeting = (date: Date | string) => {
    const now = new Date();
    const meetingDate = new Date(date);
    const diffInHours = Math.floor((meetingDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 0) return 'Past';
    if (diffInHours < 1) return 'Now';
    if (diffInHours < 24) return `In ${diffInHours}h`;
    return `In ${Math.floor(diffInHours / 24)}d`;
  };

  const getMeetingIcon = (meetingType?: string) => {
    switch (meetingType) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-600" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-green-600" />;
      case 'in-person':
        return <MapPin className="w-4 h-4 text-purple-600" />;
      default:
        return <Video className="w-4 h-4 text-blue-600" />;
    }
  };

  const displayedMeetings = showAll ? meetings : meetings.slice(0, 5);

  if (meetings.length === 0) {
    return (
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Meetings</h3>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">No upcoming meetings scheduled</p>
          <button 
            onClick={() => navigate('/calendar')}
            className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
          >
            Schedule a meeting →
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Upcoming Meetings</h3>
              <p className="text-sm text-gray-600 mt-1">
                {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'} scheduled
              </p>
            </div>
            {meetings.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                {showAll ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    View All ({meetings.length}) <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="divide-y max-h-96 overflow-y-auto">
          {displayedMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedMeeting(meeting)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      meeting.extendedProps.meetingType === 'video' 
                        ? 'bg-blue-100' 
                        : meeting.extendedProps.meetingType === 'phone'
                        ? 'bg-green-100'
                        : 'bg-purple-100'
                    }`}>
                      {getMeetingIcon(meeting.extendedProps.meetingType)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{meeting.title}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(meeting.start).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })} • 
                        {new Date(meeting.start).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>

                  {meeting.extendedProps.attendees && meeting.extendedProps.attendees.length > 0 && (
                    <div className="flex items-center mt-2">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="flex -space-x-2">
                        {meeting.extendedProps.attendees.slice(0, 3).map((attendee, index) => (
                          <div 
                            key={attendee.id} 
                            className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white"
                            style={{ zIndex: 3 - index }}
                          >
                            <span className="text-xs font-medium text-blue-600">
                              {attendee.name.charAt(0)}
                            </span>
                          </div>
                        ))}
                        {meeting.extendedProps.attendees.length > 3 && (
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white text-xs text-gray-600">
                            +{meeting.extendedProps.attendees.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4 text-right">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    meeting.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getTimeUntilMeeting(meeting.start)}
                  </span>
                  <button className="mt-2 text-gray-400 hover:text-gray-600">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {meeting.extendedProps.description && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {meeting.extendedProps.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <button 
            onClick={() => navigate('/calendar')}
            className="w-full text-center text-blue-500 hover:text-blue-600 font-medium"
          >
            View Full Calendar
          </button>
        </div>
      </div>

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Meeting Details</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {new Date(selectedMeeting.start).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedMeeting.extendedProps.meetingType === 'video' 
                    ? 'bg-blue-100' 
                    : selectedMeeting.extendedProps.meetingType === 'phone'
                    ? 'bg-green-100'
                    : 'bg-purple-100'
                }`}>
                  {getMeetingIcon(selectedMeeting.extendedProps.meetingType)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{selectedMeeting.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(selectedMeeting.start).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(selectedMeeting.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(selectedMeeting.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {selectedMeeting.status && (
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                      selectedMeeting.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedMeeting.status.charAt(0).toUpperCase() + selectedMeeting.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>

              {selectedMeeting.extendedProps.description && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Description</h4>
                  <p className="text-gray-600">{selectedMeeting.extendedProps.description}</p>
                </div>
              )}

              {selectedMeeting.extendedProps.attendees && selectedMeeting.extendedProps.attendees.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Attendees
                  </h4>
                  <div className="space-y-2">
                    {selectedMeeting.extendedProps.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium">
                              {attendee.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{attendee.name}</div>
                            <div className="text-sm text-gray-500">{attendee.role}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          attendee.status === 'accepted' 
                            ? 'bg-green-100 text-green-800' 
                            : attendee.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {attendee.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMeeting.extendedProps.notes && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Notes</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded">{selectedMeeting.extendedProps.notes}</p>
                </div>
              )}

              <div className="pt-4 flex justify-between items-center border-t">
                <button
                  onClick={() => handleRemoveMeeting(selectedMeeting.id)}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove Meeting
                </button>
                <button
                  onClick={() => setSelectedMeeting(null)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpcomingMeetings;