/// <reference types="vite/client" />

import { CalendarEvent } from './types/calendar';

declare global {
  interface Window {
    calendarEvents?: CalendarEvent[];
  }
}
