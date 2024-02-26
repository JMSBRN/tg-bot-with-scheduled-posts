import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';

export type DateTime = calendar_v3.Schema$Event['start'] // end the same in v3

export interface CalendarEventForBot {
    text?: string | null;
    start?: DateTime;
    end?: DateTime;
  }

  export type FilteredEvents = {
    withAllDayTime: CalendarEventForBot[];
    withHours: CalendarEventForBot[];
  }