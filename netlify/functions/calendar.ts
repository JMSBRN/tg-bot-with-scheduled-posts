import { HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { deleteEvent, getEvents, insertEvent, updateEvent } from '../../src/api/google-calendar/calendarApiUtils';

type OperationType = 'getEvents' | 'deleteEvent' | 'insertEvent' | 'updateEvent';
exports.handler = async function (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> {
  if (event.httpMethod !== 'POST' || !event.body) {
    return {
      statusCode: 400,
      body: 'Invalid request httpMethod must be POST with body"'
    };
  }
  
  const { operation, payload } = JSON.parse(event.body) as { operation: OperationType, payload: any };
  
  if (!(operation in ['getEvents', 'deleteEvent', 'insertEvent', 'updateEvent'])) {
    return {
      statusCode: 400,
      body: 'Invalid operation'
    };
  }
  const calendarId = process.env.CALENDAR_ID || 'primary';
  try {
    switch (operation) {
      case 'getEvents':
        const events = await getEvents(payload, calendarId);
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