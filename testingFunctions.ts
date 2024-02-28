import schedule  from 'node-schedule';
import { getEvents } from './src/api/google-calendar/calendarApiUtils';
import { scheduleJobsForEvents } from './src/utils/schedule/scheduleUtils';
import { config } from 'dotenv';
import { sendTelegramMessageWithFetch } from './src/utils/telegram/botUtils';
import { SendTelegramMessageOptions } from './src/utils/telegram/interfaces';

config();

// const rule = {
//   dayOfWeek: [0, new schedule.Range(4, 6)],
//   hour: new schedule.Range(17, 23),
//   minute: new schedule.Range(0, 59)
// }
// const job = schedule.scheduleJob('* * * * * *', async function(){
//   console.log('job run');
 
// });

async function main () {
  const events = await getEvents({
    calendarId: process.env.CALENDAR_ID,
  });
  if (Array.isArray(events) && events.length) {
    scheduleJobsForEvents(events, {
      hour:23,
      minute:59
    });
  }
} 

main();




