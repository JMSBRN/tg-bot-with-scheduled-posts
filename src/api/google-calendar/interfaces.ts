import { calendar_v3 } from 'googleapis';
import { MethodOptions } from "googleapis/build/src/apis/calendar";

export interface GetEventsOptions {
    maxResults?: number;
    daysBefore?: number;
    daysAfter?: number;
}
export interface CalendarCallsBodyPayload {
    getEventsOPtions: GetEventsOptions;
    eventId?: string;
    event?: calendar_v3.Schema$Event;
    updatedEvent?: Partial<calendar_v3.Schema$Event>;
    options?: MethodOptions;
}
export interface CalendarCallsBody {
  operation: string;
  payload: CalendarCallsBodyPayload;
  calendarId?: string;
}
