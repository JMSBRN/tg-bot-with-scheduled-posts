import { getEvents } from './src/api/google-calendar/calendarApiUtils';
import { scheduleJobsForEvents } from './src/utils/schedule/scheduleUtils';
import { config } from 'dotenv';

config();


async function main() {
  const events = await getEvents({
    calendarId: process.env.CALENDAR_ID,
  });

  if (Array.isArray(events) && events.length) {
    scheduleJobsForEvents(events, {
      hour: 20,
      minute: 48,
    });
  }
}

main();
