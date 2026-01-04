import React, { useState } from 'react';
import { X, Clock, Repeat, Users, Trash2, Calendar, Video, Phone, MapPin } from 'lucide-react';
import { CalendarEvent } from '../../types/calendar';

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete: (eventId: string) => void;
  selectedDate: Date;
  selectedEvent: CalendarEvent | null;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  selectedEvent
}) => {
  const [formData, setFormData] = useState({
    startTime: '09:00',
    endTime: '17:00',
    meetingType: 'video',
    recurrence: 'none',
    maxMeetings: 5,
    duration: 30
  });

  if (!isOpen) return null;

  const isEditing = !!selectedEvent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (selectedEvent && confirm('Are you sure you want to delete this availability slot?')) {
      onDelete(selectedEvent.id);
    }
  };



  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {isEditing ? 'Edit Availability' : 'Set Availability'}
              </h2>
              <p className="text-white/90 text-sm mt-1 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Info Banner */}
        {isEditing && selectedEvent && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 border-b border-blue-100">
            <p className="text-sm text-blue-900 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <strong className="mr-2">Created:</strong> 
              {new Date(selectedEvent.start).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                required
              />
            </div>
          </div>

          {/* Meeting Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 inline-block">
              Meeting Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'video', label: 'Video', icon: <Video className="w-5 h-5" /> },
                { value: 'phone', label: 'Phone', icon: <Phone className="w-5 h-5" /> },
                { value: 'in-person', label: 'In-Person', icon: <MapPin className="w-5 h-5" /> }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({...formData, meetingType: type.value})}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                    formData.meetingType === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type.icon}
                  <span className="text-xs font-medium mt-1">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Meeting Duration */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              Meeting Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 45, 60].map((duration) => (
                <button
                  key={duration}
                  type="button"
                  onClick={() => setFormData({...formData, duration})}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData.duration === duration
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {duration}min
                </button>
              ))}
            </div>
          </div>

          {/* Recurrence */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Repeat className="w-4 h-4 mr-2 text-blue-600" />
              Recurrence
            </label>
            <select
              value={formData.recurrence}
              onChange={(e) => setFormData({...formData, recurrence: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
            >
              <option value="none">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="weekdays">Every weekday (Mon-Fri)</option>
            </select>
          </div>

          {/* Max Meetings */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              Max Meetings Per Day
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="20"
                value={formData.maxMeetings}
                onChange={(e) => setFormData({...formData, maxMeetings: parseInt(e.target.value)})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                meetings
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Limit the number of meetings that can be booked on this day
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-between items-center border-t border-gray-200">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            ) : (
              <div></div>
            )}
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg shadow-green-500/30"
              >
                {isEditing ? 'Update' : 'Save'} Availability
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvailabilityModal;