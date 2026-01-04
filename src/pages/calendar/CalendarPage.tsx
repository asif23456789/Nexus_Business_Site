import React from 'react';
import CalendarView from '../../components/calendar/CalendarView';

export const CalendarPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <CalendarView />
    </div>
  );
};

export default CalendarPage;