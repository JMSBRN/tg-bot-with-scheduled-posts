import schedule from 'node-schedule';
import { config } from 'dotenv';
import { calendar_v3 } from 'googleapis';

config();

interface ExecuteDayTime {
  hour: number;
  minute: number;
  seconds?: number;
}

function createRecurrenceRule(startDate: Date, options?: ExecuteDayTime) {
  const { hour, minute, seconds } = options || {};
  const rule = new schedule.RecurrenceRule();
  rule.year = startDate.getFullYear();
  rule.month = startDate.getMonth();
  rule.date = startDate.getDate();
  rule.hour = hour || startDate.getHours();
  rule.minute = minute || startDate.getMinutes();
  rule.second = seconds || startDate.getSeconds();
  return rule;
}
function scheduleJobForEventWithTimeInDay(eventStartTime: Date) {
  const rule = createRecurrenceRule(eventStartTime);
  const job = schedule.scheduleJob(rule, () => {
    console.log(
      'Job from scheduleJobForEventWithTimeInDay executed at',
      new Date(),
    );
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
    console.log(
      'Job from scheduleJobForEventWithAllDay executed at',
      new Date(),
    );
    job.cancel();
  });
  // start in midnight ??
}

function scheduleJobsForEvents(
  events: calendar_v3.Schema$Event[],
  optionsForAllDay?: ExecuteDayTime,
) {
  const currentDate = new Date();
  events.forEach((event) => {
    if (event.start?.date) {
      scheduleJobForEventWithAllDay(event.start.date, optionsForAllDay);
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

export {
  scheduleJobForEventWithAllDay,
  scheduleJobForEventWithTimeInDay,
  scheduleJobsForEvents,
};
