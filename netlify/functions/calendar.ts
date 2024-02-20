import { HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { deleteEvent, getEvents, insertEvent, updateEvent } from '../../src/api/google-calendar/calendarApiUtils';

exports.handler = async function (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> {
  const { operation, payload } = JSON.parse(event.body || '') as { operation: string, payload: any };
  const calendarId = process.env.CALENDAR_ID || 'primary';
  try {
    switch (operation) {
      case 'getEvents':
        const events = await getEvents(payload);
        return {
          statusCode: 200,
          body: JSON.stringify(events)
        };
      case 'deleteEvent':
        const deleteRes = await deleteEvent(payload.eventId, calendarId);
        return {
          statusCode: 200,
          body: JSON.stringify(deleteRes)
        };
      case 'insertEvent':
        const insertedEvent = await insertEvent(payload.event, calendarId);
        return {
          statusCode: 200,
          body: JSON.stringify(insertedEvent)
        };
      case 'updateEvent':
        const updatedEvent = await updateEvent(payload.eventId, payload.updatedEvent, calendarId, payload.options);
        return {
          statusCode: 200,
          body: JSON.stringify(updatedEvent)
        };
      default:
        return {
          statusCode: 400,
          body: 'Invalid operation'
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `${operation} - ${(error as Error).message}` })
    };
  }
};