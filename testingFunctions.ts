import { getEvents } from './src/api/google-calendar/calendarApiUtils';
import { GetEventsOptions } from './src/api/google-calendar/interfaces';
import { config } from 'dotenv';
import { CalendarEventForBot, DateTime, FilteredEvents } from './src/utils/bot-utils/scheduled-posts/inrerfaces';
import { CronJob } from 'cron';

config();

async function getEventsFromCalendar() {
  const options: GetEventsOptions = {
    calendarId: process.env.CALENDAR_ID,
    maxResults: 10,
    daysBefore: 10000,
    daysAfter: 1000,
  };
  return await getEvents(options);
}

async function getEventsForBot(): Promise<FilteredEvents | undefined>{
  const events = await getEventsFromCalendar();
  if (Array.isArray(events)) {
    const newEvents: CalendarEventForBot[] = events.map((el) => {
      
      return {
        text: el.summary,
        start: el.start,
        end: el.end,
      };
    });
    const eventsStartWithAllDayTime = newEvents.filter((event) => {
      return event.start?.date;
    })
    const eventsStartWithHours = newEvents.filter((event) => {
      return event.start?.dateTime;
    })

    return { withAllDayTime: eventsStartWithAllDayTime, withHours: eventsStartWithHours };
  }
}


const checkEventsWithSchedule = new CronJob(
  '* * * * * *', // every second
  async function () {
    try {
      const events = await getEventsForBot();
      console.log('stop job');
      checkEventsWithSchedule.stop();
      if (Array.isArray(events)) {
        console.log('events resolved');
        console.log(events);
        checkEventsWithSchedule.start();
      }
    } catch (error) {
      console.error('Error getting events:', error);
    }
  },
  null, // onComplete
  false, // auto start
);

//checkEventsWithSchedule.start();





function compareDateFromStartByDay(start:{ date: string }) {
  const currentDay = new Date().setUTCHours(0, 0, 0, 0);
  if (!start?.date) {
    return false;
  }
    const startDay = new Date(start.date as string).setUTCHours(0, 0, 0, 0);
    return startDay === currentDay
  
}

function compareDateFromStartByHour(start: { dateTime: string }): boolean {
  const now = new Date();
  const currentHour = now.setHours(now.getHours(), 0, 0, 0);

  if (!start?.dateTime) {
    return false;
  }
  const startDate = new Date(start.dateTime.slice(0, -5)); // remove time zone
  const startHour = startDate.setHours(startDate.getHours(), 0, 0, 0);
 
  return currentHour === startHour;
}
async function main() {

  
}

main();









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
