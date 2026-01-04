import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import CalendarView from '../../components/calendar/CalendarView';

const CalendarPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <CalendarView />
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;