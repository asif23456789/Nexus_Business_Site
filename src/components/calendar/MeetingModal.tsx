import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Video, Phone, MapPin, MessageSquare, Trash2 } from 'lucide-react';
import { CalendarEvent } from '../../types/calendar';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  selectedDate: Date;
  selectedEvent: CalendarEvent | null;
  onRespond: (eventId: string, status: 'accepted' | 'declined') => void;
  onDelete: (eventId: string) => void;
}

const MeetingModal: React.FC<MeetingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  selectedEvent,
  onRespond,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(!selectedEvent);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    meetingType: 'video' | 'phone' | 'in-person';
    duration: number;
    notes: string;
  }>({
    title: selectedEvent?.title || '',
    description: selectedEvent?.extendedProps.description || '',
    meetingType: (selectedEvent?.extendedProps.meetingType as 'video' | 'phone' | 'in-person') || 'video',
    duration: selectedEvent?.extendedProps.duration || 30,
    notes: selectedEvent?.extendedProps.notes || ''
  });

  if (!isOpen) return null;

  const isRequest = selectedEvent?.status === 'pending';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, date: selectedDate });
    onClose();
  };

  const handleDelete = () => {
    if (selectedEvent && confirm('Are you sure you want to delete this meeting?')) {
      onDelete(selectedEvent.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {selectedEvent ? 'Meeting Details' : 'Schedule Meeting'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {selectedEvent && !isEditing && (
          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedEvent.type === 'meeting' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {selectedEvent.extendedProps.meetingType === 'video' && <Video className="w-5 h-5 text-blue-600" />}
                {selectedEvent.extendedProps.meetingType === 'phone' && <Phone className="w-5 h-5 text-blue-600" />}
                {selectedEvent.extendedProps.meetingType === 'in-person' && <MapPin className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{selectedEvent.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(selectedEvent.start).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(selectedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {selectedEvent.status && (
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    selectedEvent.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedEvent.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                  </span>
                )}
              </div>
            </div>

            {selectedEvent.extendedProps.description && (
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Description</h4>
                <p className="text-gray-600">{selectedEvent.extendedProps.description}</p>
              </div>
            )}

            {selectedEvent.extendedProps.attendees && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Attendees
                </h4>
                <div className="space-y-2">
                  {selectedEvent.extendedProps.attendees.map((attendee) => (
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

            {selectedEvent.extendedProps.notes && (
              <div>
                <h4 className="font-medium text-gray-700 mb-1 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Notes
                </h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">{selectedEvent.extendedProps.notes}</p>
              </div>
            )}

            {isRequest && (
              <div className="pt-4 border-t bg-yellow-50 -mx-6 -mb-6 px-6 py-4">
                <p className="text-sm font-medium text-yellow-900 mb-3">You have a pending meeting request</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      onRespond(selectedEvent.id, 'declined');
                    }}
                    className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => {
                      onRespond(selectedEvent.id, 'accepted');
                    }}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Accept Meeting
                  </button>
                </div>
              </div>
            )}

            {!isRequest && (
              <div className="pt-4 flex justify-between items-center border-t">
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Meeting
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {(!selectedEvent || isEditing) && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Investor Pitch Meeting"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Brief description of the meeting purpose..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Type
                </label>
                <select
                  value={formData.meetingType}
                  onChange={(e) => setFormData({
                    ...formData, 
                    meetingType: e.target.value as 'video' | 'phone' | 'in-person'
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Any additional notes..."
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  if (selectedEvent) {
                    setIsEditing(false);
                  } else {
                    onClose();
                  }
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {selectedEvent ? 'Update Meeting' : 'Schedule Meeting'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MeetingModal;