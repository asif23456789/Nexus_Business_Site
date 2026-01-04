import { CalendarEvent, AvailabilitySlot, MeetingRequest } from '../types/calendar';

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Weekly Availability',
    start: '2024-01-01T09:00:00',
    end: '2024-01-01T17:00:00',
    type: 'availability',
    color: '#10B981',
    extendedProps: {
      description: 'Available for meetings',
      meetingType: 'video',
      duration: 30
    }
  },
  {
    id: '2',
    title: 'Meeting with Investor',
    start: '2024-01-02T14:00:00',
    end: '2024-01-02T14:30:00',
    type: 'meeting',
    status: 'confirmed',
    color: '#3B82F6',
    extendedProps: {
      description: 'Pitch presentation',
      location: 'Zoom Meeting',
      attendees: [
        {
          id: '101',
          name: 'John Entrepreneur',
          email: 'john@startup.com',
          role: 'entrepreneur',
          status: 'accepted'
        },
        {
          id: '102',
          name: 'Sarah Investor',
          email: 'sarah@vc.com',
          role: 'investor',
          status: 'accepted'
        }
      ],
      meetingType: 'video',
      meetingLink: 'https://zoom.us/j/123456',
      duration: 30,
      notes: 'Prepare pitch deck'
    }
  },
  {
    id: '3',
    title: 'Team Sync',
    start: '2024-01-03T10:00:00',
    end: '2024-01-03T11:00:00',
    type: 'meeting',
    status: 'pending',
    color: '#F59E0B',
    extendedProps: {
      description: 'Weekly team sync',
      location: 'Conference Room A',
      meetingType: 'in-person',
      duration: 60
    }
  }
];

export const mockAvailabilitySlots: AvailabilitySlot[] = [
  {
    id: 'avail-1',
    userId: 'user-123',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '17:00',
    recurrence: 'weekly',
    maxMeetingsPerDay: 5,
    meetingTypes: ['video', 'phone', 'in-person']
  },
  {
    id: 'avail-2',
    userId: 'user-123',
    dayOfWeek: 2, // Tuesday
    startTime: '10:00',
    endTime: '16:00',
    recurrence: 'weekly',
    maxMeetingsPerDay: 3,
    meetingTypes: ['video']
  }
];

export const mockMeetingRequests: MeetingRequest[] = [
  {
    id: 'req-1',
    title: 'Funding Discussion',
    requesterId: 'ent-456',
    requestedUserId: 'inv-789',
    requestedDate: new Date('2024-01-05'),
    startTime: '14:00',
    endTime: '14:30',
    duration: 30,
    purpose: 'Discuss seed funding round',
    meetingType: 'video',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'req-2',
    title: 'Product Demo',
    requesterId: 'inv-789',
    requestedUserId: 'ent-456',
    requestedDate: new Date('2024-01-06'),
    startTime: '11:00',
    endTime: '12:00',
    duration: 60,
    purpose: 'Demo of new features',
    meetingType: 'video',
    status: 'accepted',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];