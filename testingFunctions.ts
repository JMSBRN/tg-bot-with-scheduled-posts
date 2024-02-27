import { config } from 'dotenv';
import {
  getCalendar,
  getEvents,
} from './src/api/google-calendar/calendarApiUtils';
import { v4 as uuidv4 } from 'uuid';

config();

async function main() {
  const calendar = await getCalendar();
  const events = await getEvents({
    calendarId: process.env.CALENDAR_ID,
  });
  if (Array.isArray(events)) {
    events?.forEach(async (el) => {
      if (el.status === 'confirmed') {
        try {
         const watch = await calendar.events.watch({
            calendarId: process.env.CALENDAR_ID,
            requestBody: {
              id: uuidv4(),
              address: `https://7082-37-215-46-103.ngrok-free.app/.netlify/functions/calendarWebHook/${el.id}`,
              type: 'web_hook',
            },
            
          });
          
        } catch (error) {
          console.error(`Failed to create watcher for event ${el.id}`);
        }
      }
    });
  }
}

main();
