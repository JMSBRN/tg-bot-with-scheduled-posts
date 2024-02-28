import schedule from 'node-schedule';
import { getEvents } from './src/api/google-calendar/calendarApiUtils';
import { config } from 'dotenv';
import { calendar_v3 } from 'googleapis';

config();

interface ExecuteDayTime {
  hour: number;
  minute: number;
  seconds?: number;
}

function createRecurrenceRule(startDate: Date, options?: ExecuteDayTime) {
  const {
    hour = 0,
    minute = 0,
    seconds = 0,
  } = options || ({} as ExecuteDayTime);
  const rule = new schedule.RecurrenceRule();
  rule.year = startDate.getFullYear();
  rule.month = startDate.getMonth();
  rule.date = startDate.getDate();
  rule.hour = hour;
  rule.minute = minute;
  rule.second = seconds;
  return rule;
}
function scheduleJobForEventWithTimeInDay(eventStartTime: Date) {
  const rule = createRecurrenceRule(eventStartTime);
  const job = schedule.scheduleJob(rule, () => {
    console.log('Job from scheduleJobForEventWithTimeInDay executed at', new Date());
    job.cancel();
  });
}

function scheduleJobForEventWithAllDay(
  startDateStr: string,
  options?: ExecuteDayTime,
) {
  const startDate = new Date(startDateStr);
  const rule = createRecurrenceRule(startDate, options);
  const job = schedule.scheduleJob(rule, () => {
    console.log('Job from scheduleJobForEventWithAllDay executed at', new Date());
    job.cancel();
  });
  // start in midnight ??
}

function scheduleJobsForEvents(events: calendar_v3.Schema$Event[]) {
  const currentDate = new Date();
  console.log(currentDate);
  events.forEach((event) => {
    if (event.start?.date) {
      scheduleJobForEventWithAllDay(event.start.date, {
        hour: 20,
        minute: 20,
      });
    }
    if (event.start?.dateTime) {
      const eventDateTime = new Date(event.start.dateTime);
      if (eventDateTime < currentDate) {
        return;
      }
      scheduleJobForEventWithTimeInDay(eventDateTime);
    }
  });
}


async function main() {
  const events = await getEvents({
    calendarId: process.env.CALENDAR_ID,
  });

  if (Array.isArray(events) && events.length) {
    scheduleJobsForEvents(events);
  }
}

main();
