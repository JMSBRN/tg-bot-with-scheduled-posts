import { HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { deleteEvent, getEvents, insertEvent, updateEvent } from '../../src/api/google-calendar/calendarApiUtils';
import { CalendarCallsBody, GetEventsOptions } from '../../src/api/google-calendar/interfaces';

exports.handler = async function (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> {
  const httpMethod = event.httpMethod;
  const { payload, calendarId } = JSON.parse(event.body!) as CalendarCallsBody;
  const calId = calendarId || process.env.CALENDAR_ID || 'primary';
  const params = new URLSearchParams(event.rawUrl);
  try {
    switch (httpMethod) {
      case 'GET':
        const events = await getEvents(params, calId);
        return {
          statusCode: 200,
          body: JSON.stringify(events)
        };
      case 'DELETE':
        const deleteRes = await deleteEvent(payload?.eventId!, calId);
        return {
          statusCode: 204,
          body: ''
        };
      case 'POST':
        const insertedEvent = await insertEvent(payload?.event!, calId);
        return {
          statusCode: 201,
          body: JSON.stringify(insertedEvent)
        };
      case 'PUT':
        const updatedEvent = await updateEvent(payload?.eventId!, payload?.updatedEvent!, calId, payload?.options);
        return {
          statusCode: 200,
          body: JSON.stringify(updatedEvent)
        };
      default:
        return {
          statusCode: 405,
          body: 'Invalid method'
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `method: ﹩{httpMethod} - ﹩{(error as Error).message}` })
    };
  }
};