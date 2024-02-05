import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';
import { google } from 'googleapis';
import { config } from 'dotenv';
import { credentials } from '../../src/utils/google-calendar/credentials';

config();

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const calendarId = process.env.CALENDAR_ID;

  if (!calendarId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'CALENDAR_ID environment variable is not set.' }),
    };
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: credentials.web,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({
      version: 'v3',
      auth: auth,
    });

    const { data } = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return {
      statusCode: 200,
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    console.error('Error fetching calendar events:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};

export { handler };
