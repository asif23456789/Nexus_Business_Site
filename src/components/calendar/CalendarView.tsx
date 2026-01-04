import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import { CalendarEvent } from '../../types/calendar';
import EventContent from './EventContent';
import CalendarToolbar from './CalendarToolbar';
import AvailabilityModal from './AvailabilityModal';
import MeetingModal from './MeetingModal';
import { mockCalendarEvents } from '../../data/calenderData';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CalendarView: React.FC = () => {
  const { user } = useAuth();
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState('dayGridMonth');

  // Load events from memory on mount
  useEffect(() => {
    const storedEvents = window.calendarEvents || mockCalendarEvents;
    setEvents(storedEvents);
  }, []);

  // Save events to global variable for cross-component sync
  useEffect(() => {
    window.calendarEvents = events;
    // Dispatch custom event for dashboard to listen
    window.dispatchEvent(new CustomEvent('calendarEventsUpdated', { detail: events }));
  }, [events]);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      if (event.type === 'availability') {
        setShowAvailabilityModal(true);
      } else if (event.type === 'meeting') {
        setShowMeetingModal(true);
      }
    }
  };

  const handleDateClick = (selectInfo: DateSelectArg) => {
    setSelectedDate(new Date(selectInfo.start));
    setSelectedEvent(null);
    setShowMeetingModal(true);
  };

  const handleAddAvailability = () => {
    setSelectedEvent(null);
    setSelectedDate(new Date());
    setShowAvailabilityModal(true);
  };

  const handleSaveAvailability = (availabilityData: {
    startTime: string;
    endTime: string;
    meetingType: string;
    recurrence: string;
    maxMeetings: number;
    duration: number;
  }) => {
    if (selectedEvent) {
      // Update existing availability
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: `Available (${availabilityData.meetingType})`,
              extendedProps: {
                ...event.extendedProps,
                description: `Available from ${availabilityData.startTime} to ${availabilityData.endTime}`,
                meetingType: availabilityData.meetingType as 'video' | 'phone' | 'in-person',
              },
            }
          : event
      );
      setEvents(updatedEvents);
      toast.success('Availability updated successfully!');
    } else {
      // Create new availability
      const newEvent: CalendarEvent = {
        id: `avail-${Date.now()}`,
        title: `Available (${availabilityData.meetingType})`,
        start: selectedDate,
        end: new Date(selectedDate.getTime() + availabilityData.duration * 60000),
        type: 'availability',
        color: '#10b981',
        extendedProps: {
          description: `Available from ${availabilityData.startTime} to ${availabilityData.endTime}`,
          meetingType: availabilityData.meetingType as 'video' | 'phone' | 'in-person',
        },
      };
      setEvents([...events, newEvent]);
      toast.success('Availability added successfully!');
    }
    setShowAvailabilityModal(false);
  };

  const handleSaveMeeting = (meetingData: {
    title: string;
    description: string;
    meetingType: 'video' | 'phone' | 'in-person';
    duration: number;
    notes: string;
    date: Date;
  }) => {
    if (!user) return;

    if (selectedEvent) {
      // Update existing meeting
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: meetingData.title,
              start: meetingData.date,
              end: new Date(meetingData.date.getTime() + meetingData.duration * 60000),
              extendedProps: {
                ...event.extendedProps,
                description: meetingData.description,
                meetingType: meetingData.meetingType,
                notes: meetingData.notes,
              },
            }
          : event
      );
      setEvents(updatedEvents);
      toast.success('Meeting updated successfully!');
    } else {
      // Create new meeting
      const newEvent: CalendarEvent = {
        id: `meet-${Date.now()}`,
        title: meetingData.title,
        start: meetingData.date,
        end: new Date(meetingData.date.getTime() + meetingData.duration * 60000),
        type: 'meeting',
        status: 'pending',
        color: '#3b82f6',
        extendedProps: {
          description: meetingData.description,
          meetingType: meetingData.meetingType,
          notes: meetingData.notes,
          creator: user.id,
        },
      };
      setEvents([...events, newEvent]);
      toast.success('Meeting request sent successfully!');
    }
    setShowMeetingModal(false);
  };

  const handleRespondToMeeting = (eventId: string, status: 'accepted' | 'declined') => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const finalStatus: 'confirmed' | 'declined' = status === 'accepted' ? 'confirmed' : 'declined';
        toast.success(`Meeting ${finalStatus}!`);
        return { ...event, status: finalStatus };
      }
      return event;
    });
    setEvents(updatedEvents);
    setShowMeetingModal(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    toast.success('Event deleted!');
    setShowAvailabilityModal(false);
    setShowMeetingModal(false);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
      <CalendarToolbar 
        onAddAvailability={handleAddAvailability}
        currentView={currentView}
        onViewChange={handleViewChange}
        calendarRef={calendarRef}
      />
      
      <div className="mt-6 bg-white rounded-xl shadow-sm p-2 sm:p-4 border border-gray-100">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          headerToolbar={false}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          eventClick={handleEventClick}
          select={handleDateClick}
          eventContent={EventContent}
          height="auto"
          contentHeight="auto"
          aspectRatio={1.8}
          eventClassNames="cursor-pointer hover:opacity-80 transition-opacity duration-200"
          dayCellClassNames="hover:bg-blue-50 transition-colors duration-200"
        />
      </div>

      {showAvailabilityModal && (
        <AvailabilityModal
          isOpen={showAvailabilityModal}
          onClose={() => {
            setShowAvailabilityModal(false);
            setSelectedEvent(null);
          }}
          onSave={handleSaveAvailability}
          onDelete={handleDeleteEvent}
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
        />
      )}

      {showMeetingModal && (
        <MeetingModal
          isOpen={showMeetingModal}
          onClose={() => {
            setShowMeetingModal(false);
            setSelectedEvent(null);
          }}
          onSave={handleSaveMeeting}
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
          onRespond={handleRespondToMeeting}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default CalendarView;