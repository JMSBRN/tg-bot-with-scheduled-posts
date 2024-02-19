import { getAuthenticatedClient } from '../../src/api/auth/auth';
import { google, Auth } from 'googleapis';

const handler = async () => {
  const rootClient = (await getAuthenticatedClient()) as Auth.OAuth2Client;
  try {
    const calendar = google.calendar({ version: 'v3', auth: rootClient });
    const res = await calendar.events.list({
      calendarId: 'zakhavai@gmail.com',
      maxResults: 1,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events: events }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Failed to retrieve events with error ${error}`,
      }),
    };
  }
};

export { handler };
