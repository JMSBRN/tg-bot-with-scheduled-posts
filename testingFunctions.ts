import { getEvents } from './src/api/google-calendar/calendarApiUtils';
import { GetEventsOptions } from './src/api/google-calendar/interfaces';
import { config } from 'dotenv';
import { CalendarEventForBot } from './src/utils/bot-utils/scheduled-posts/inrerfaces';
import { CronJob } from 'cron';

config();

async function getEventsFromCalendar() {
  const options: GetEventsOptions = {
    calendarId: process.env.CALENDAR_ID,
    maxResults: 10,
    daysBefore: 0,
    daysAfter: 1000,
  };
  return await getEvents(options);
}

async function getEventsForBot():Promise<CalendarEventForBot[] | undefined> {
  const events = await getEventsFromCalendar();
  if (events?.length) {
    const newEvents: CalendarEventForBot[] = events.map((el) => {
      return {
        text: el.summary,
        start: el.start,
        end: el.end,
      };
    });
    return newEvents;
  }
}


const checkEventsWithSchedule = new CronJob(
    '* * * * * *', // every second
    async function () {
      console.log('stop job');
      checkEventsWithSchedule.stop();
  
      try {
        const events = await getEventsForBot();
        if (Array.isArray(events)) {
          console.log('events resolved');
          console.log(events);
          setTimeout(() => {
            checkEventsWithSchedule.start();
          }, 1000); // wait for 1 second before starting the next tick
        }
      } catch (error) {
        console.error('Error getting events:', error);
        setTimeout(() => {
          checkEventsWithSchedule.start();
        }, 60000); // wait for 1 minute before starting the next tick
      }
    },
    null, // onComplete
    false, // auto start
  );

  console.log('start job');
  checkEventsWithSchedule.start();
















/**
 * [
  {
    kind: 'calendar#event',
    etag: '"3417527016666000"',
    id: '6g4mvhj0bo7cnmrofsbvpfhcaj',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=Nmc0bXZoajBibzdjbm1yb2ZzYnZwZmhjYWogNmM2NzcwMmMzODMxZGRkYWI0YWYwZjRhODczY2YyZjQxZDY5ZDQ2NzBjZjUwNDgzMGZjY2ZiOTAxZTcxZWY4MUBn',
    created: '2024-02-22T12:10:58.000Z',
    updated: '2024-02-24T08:31:48.333Z',
    summary: 'dfdsf',
    creator: { email: 'zakhavai@gmail.com' },
    organizer: {
      email: '6c67702c3831dddab4af0f4a873cf2f41d69d4670cf504830fccfb901e71ef81@group.calendar.google.com',
      displayName: 'Bot Posts',
      self: true
    },
    start: { date: '2024-02-24' },
    end: { date: '2024-02-25' },
    transparency: 'transparent',
    iCalUID: '6g4mvhj0bo7cnmrofsbvpfhcaj@google.com',
    sequence: 1,
    reminders: { useDefault: false },
    eventType: 'default'
  }
]
 */
