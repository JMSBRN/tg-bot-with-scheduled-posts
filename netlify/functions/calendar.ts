import { HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { deleteEvent, getEvents, insertEvent, updateEvent } from '../../src/api/google-calendar/calendarApiUtils';
import { CalendarCallsBody, CalendarCallsBodyPayload } from '../../src/api/google-calendar/interfaces';

exports.handler = async function (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> {
  if (event.httpMethod !== 'POST' || !event.body) {
    return {
      statusCode: 400,
      body: 'Invalid request http method must be POST, with body"'
    };
  }
  
  const { operation, payload, calendarId, getEventsOPtions } = JSON.parse(event.body) as CalendarCallsBody;
  const calId = calendarId || process.env.CALENDAR_ID || 'primary';
  try {
    switch (operation) {
      case 'getEvents':
        const events = await getEvents(getEventsOPtions, calId);
        return {
          statusCode: 200,
          body: JSON.stringify(events)
        };
      case 'deleteEvent':
        const deleteRes = await deleteEvent(payload?.eventId!, calId);
        return {
          statusCode: 200,
          body: JSON.stringify(deleteRes)
        };
      case 'insertEvent':
        const insertedEvent = await insertEvent(payload?.event!, calId);
        return {
          statusCode: 200,
          body: JSON.stringify(insertedEvent)
        };
      case 'updateEvent':
        const updatedEvent = await updateEvent(payload?.eventId!, payload?.updatedEvent!, calId, payload?.options);
        return {
          statusCode: 200,
          body: JSON.stringify(updatedEvent)
        };
      default:
        return {
          statusCode: 400,
          body: 'Invalid operation '
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `${operation} - ${(error as Error).message}` })
    };
  }
};