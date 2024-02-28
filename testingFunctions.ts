import { config } from 'dotenv';
import {
  getCalendar,
  getEvents,
} from './src/api/google-calendar/calendarApiUtils';
import { v4 as uuidv4 } from 'uuid';

config();

async function setWebHookForEveryEvent() {
  const calendar = await getCalendar();
  const events = await getEvents({
    calendarId: process.env.CALENDAR_ID,
  });
  
  if (Array.isArray(events) && events.length > 0) {
    events?.forEach(async (el) => {
      if (el.status === 'confirmed') {
        try {
         await calendar.events.watch({
           calendarId: process.env.CALENDAR_ID,
            requestBody: {
              id: uuidv4(),
              address: `https://a3d5-37-215-47-103.ngrok-free.app/.netlify/functions/calendarWebHook/${el.id}`,
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

//setWebHookForEveryEvent();

async function chanelsStop() {
  const calendar = await getCalendar();
  const events = await getEvents({
    calendarId: process.env.CALENDAR_ID,
  });

  console.log(events);
  
  
  
}

chanelsStop();
