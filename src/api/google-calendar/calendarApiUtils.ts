import {Auth, calendar_v3, google } from "googleapis";
import { getAuthenticatedClient } from "../auth/auth";
import { MethodOptions } from "googleapis/build/src/apis/calendar";
import { GetEventsOptions } from "./interfaces";
  

const getCalendar = async (): Promise<calendar_v3.Calendar> => {
    const authenticatedClient = (await getAuthenticatedClient()) as Auth.OAuth2Client;
    return google.calendar({ version: 'v3', auth: authenticatedClient });
};


const getEvents = async (options: GetEventsOptions | undefined): Promise<calendar_v3.Schema$Event[] | undefined> => {
    const {
        calendarId = 'primary',
        maxResults = 1000,
        daysBefore = 0,
        daysAfter = 365
    } = options || {} as GetEventsOptions;

    const calendar: calendar_v3.Calendar = await getCalendar();
    const currentTime: number = new Date().getTime();
    const minTime: string = new Date(currentTime - daysBefore * 24 * 60 * 60 * 1000).toISOString();
    const maxTime: string = new Date(currentTime + daysAfter * 24 * 60 * 60 * 1000).toISOString();
    try {
        const response = await calendar.events.list({
            calendarId,
            timeMin: minTime,
            timeMax: maxTime,
            maxResults: maxResults || 1,
            singleEvents: true,
            orderBy: 'startTime',
        });

        return response.data.items;
    } catch (error) {
        console.error(error);
    }
};
const deleteEvent = async (eventId: string, calendarId: string ) => {
    const calendar: calendar_v3.Calendar = await getCalendar();
    try {
        const res = await calendar.events.delete({
            calendarId,
            eventId
        });
       return {
         data: 'Event deleted successfully',
         status: res.status
        };
    } catch (error) {
        console.error(error);
    }
};

const insertEvent = async (event: calendar_v3.Schema$Event, calendarId: string): Promise<calendar_v3.Schema$Event> => {
    const calendar: calendar_v3.Calendar = await getCalendar();
    try {
        const response = await calendar.events.insert({
            calendarId,
            requestBody: event
            
        });
        return response.data;
    } catch (error) {
        console.error('Error inserting event:', error);
        throw error;
    }
};

const updateEvent = async (eventId: string, event: Partial<calendar_v3.Schema$Event>, calendarId: string, options: MethodOptions | undefined): Promise<calendar_v3.Schema$Event> => {
    const calendar: calendar_v3.Calendar = await getCalendar();
    try {
        const response = await calendar.events.update({
            calendarId,
            eventId,
            requestBody: event
        }, options);
        return response.data;
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

 const  convertParamsToObject = (url: string): { error: string } | Partial<GetEventsOptions> => {
    const searchParams = new URLSearchParams(url);
    const paramsObject: Partial<GetEventsOptions> = {};
    let errorMessage = '';
  
    for (const [key, value] of searchParams.entries()) {
      if (key === 'maxResults') {
        paramsObject.maxResults = Number(value);
      } else if (key === 'daysBefore') {
        paramsObject.daysBefore = Number(value);
      } else if (key === 'daysAfter') {
        paramsObject.daysAfter = Number(value);
      } else if (key === 'calendarId') {
        paramsObject.calendarId = String(value);
      } else {
        errorMessage += `Unknown parameter: ${key}`;
      }
    }
  
    if (errorMessage) {
      return { error: errorMessage };
    }
  
    return paramsObject;
  }

export {
    getCalendar,
    getEvents,
    deleteEvent,
    insertEvent,
    updateEvent,
    convertParamsToObject
}