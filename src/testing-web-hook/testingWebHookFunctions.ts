import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { getCalendar, getEvents } from '../api/google-calendar/calendarApiUtils';

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
              address: `https://7843-37-215-47-103.ngrok-free.app/.netlify/functions/calendarWebHook/${el.id}`,
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
  const chanels = await calendar.channels.stop({
    requestBody: {
      type: 'web_hook'
    }
  });

  console.log(chanels);
    
}

//chanelsStop();
