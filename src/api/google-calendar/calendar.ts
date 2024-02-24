import { HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { convertParamsToObject, deleteEvent, getEvents, insertEvent, updateEvent } from '../../src/api/google-calendar/calendarApiUtils';
import { CalendarCallsBody } from '../../src/api/google-calendar/interfaces';


export async function handler(event: HandlerEvent, context: HandlerContext): Promise<{ statusCode: number, body: string }> {
  const httpMethod = event.httpMethod;
  let params: { [key: string]: string | number } = {};
  if (httpMethod === 'GET') {
    const qwuery = event.rawQuery;
    params = convertParamsToObject(`?${qwuery}`);
    if ('error' in params) {
      return {
        statusCode: 400,
        body: JSON.stringify(params)
      };
    }
    const events = await getEvents(params);
    return {
      statusCode: 200,
      body: JSON.stringify(events)
    };
  }
  const body = JSON.parse(event.body!);
  const { calendarId } = body as CalendarCallsBody;
  const calId = calendarId || process.env.CALENDAR_ID || 'primary';
  switch (httpMethod) {
    case 'DELETE':
      const deleteRes = await deleteEvent(body.eventId!, calId);
      return {
        statusCode: 204,
        body: ''
      };
    case 'POST':
      const insertedEvent = await insertEvent(body.event!, calId);
      return {
        statusCode: 201,
        body: JSON.stringify(insertedEvent)
      };
    case 'PUT':
      const updatedEvent = await updateEvent(body.eventId!, body.updatedEvent!, calId, body.options);
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
}