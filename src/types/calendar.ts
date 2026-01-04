export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
  color?: string;
  type: 'availability' | 'meeting' | 'blocked';
  status?: 'pending' | 'confirmed' | 'declined' | 'cancelled';
  extendedProps: {
    description?: string;
    location?: string;
    attendees?: Attendee[];
    creator?: string;
    meetingType?: 'video' | 'phone' | 'in-person';
    meetingLink?: string;
    duration?: number; // in minutes
    notes?: string;
  };
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'entrepreneur' | 'investor' | 'admin';
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  recurrence?: 'weekly' | 'biweekly' | 'monthly';
  maxMeetingsPerDay?: number;
  meetingTypes: string[];
}

export interface MeetingRequest {
  id: string;
  title: string;
  requesterId: string;
  requestedUserId: string;
  requestedDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  purpose: string;
  meetingType: 'video' | 'phone' | 'in-person';
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarState {
  events: CalendarEvent[];
  availabilitySlots: AvailabilitySlot[];
  meetingRequests: MeetingRequest[];
  selectedEvent: CalendarEvent | null;
  selectedDate: Date;
  currentView: string;
}