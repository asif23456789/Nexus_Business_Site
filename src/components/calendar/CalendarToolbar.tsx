import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import { format } from 'date-fns';

interface CalendarToolbarProps {
  onAddAvailability: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  calendarRef: React.RefObject<FullCalendar>;
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  onAddAvailability,
  currentView,
  onViewChange,
  calendarRef
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const updateCurrentDate = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handlePrevious = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      updateCurrentDate();
    }
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
      updateCurrentDate();
    }
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
      updateCurrentDate();
    }
  };

  // Update currentDate whenever calendarRef or view changes
  useEffect(() => {
    updateCurrentDate();
  }, [calendarRef, currentView]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')} {/* Month and Year */}
        </h1>
        <p className="text-gray-600 mt-1">Schedule and manage your meetings</p>
      </div>
      
      <div className="flex flex-wrap gap-1 items-center">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={handlePrevious}
            className="p-1 hover:bg-white rounded transition-colors"
            title="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <button
            onClick={handleToday}
            className="px-2 py-2 hover:bg-white rounded transition-colors text-sm font-medium text-gray-700"
          >
            Today
          </button>
          
          <button
            onClick={handleNext}
            className="p-1 hover:bg-white rounded transition-colors"
            title="Next"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* View Selector */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewChange('dayGridMonth')}
            className={`px-2 py-2 rounded transition-colors text-sm font-medium ${
              currentView === 'dayGridMonth'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-white'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-1" />
            Month
          </button>
          
          <button
            onClick={() => onViewChange('timeGridWeek')}
            className={`px-2 py-2 rounded transition-colors text-sm font-medium ${
              currentView === 'timeGridWeek'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-white'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-1" />
            Week
          </button>
          
          <button
            onClick={() => onViewChange('timeGridDay')}
            className={`px-2 py-2 rounded transition-colors text-sm font-medium ${
              currentView === 'timeGridDay'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-white'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-1" />
            Day
          </button>
        </div>
        
        {/* Action Buttons */}
        <button
          onClick={onAddAvailability}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-lg transition-colors"
        >
          <Clock className="w-4 h-4" />
          <span>Add Availability</span>
        </button>
        
        <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors">
          <Video className="w-4 h-4" />
          <span>New Meeting</span>
        </button>
      </div>
    </div>
  );
};

export default CalendarToolbar;
