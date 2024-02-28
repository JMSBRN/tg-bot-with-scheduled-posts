import schedule from 'node-schedule';
import { config } from 'dotenv';
import { calendar_v3 } from 'googleapis';
import { ResponsForSendMessageWithFetch, SendTelegramMessageOptions } from '../telegram/interfaces';
import { sendTelegramMessageWithFetch } from '../telegram/botUtils';

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

function scheduleJobForEventWithTimeInDay(eventStartTime: Date, fetchFunction?: Promise<ResponsForSendMessageWithFetch>) {
  const rule = createRecurrenceRule(eventStartTime);
  const job = schedule.scheduleJob(rule, async function () {
     if (fetchFunction) {
      await fetchFunction;
      job.cancel();
     }
    job.cancel();
  });
}

function scheduleJobForEventWithAllDay(
  startDateStr: string,
  options?: ExecuteDayTime
) {
  const startDate = new Date(startDateStr);
  const rule = createRecurrenceRule(startDate, options);
  const job = schedule.scheduleJob(rule, async function () {
         const res = await sendTelegramMessageWithFetch({
           chat_id: process.env.TELEGRAM_CHAT_ID!,
           text: 'Today is recognized by Rebecca Black!',
           bot_token: process.env.TELEGRAM_BOT_TOKEN!,
         });
       job.cancel();
  });
  // start in midnight ??
}

function scheduleJobsForEvents(
  events: calendar_v3.Schema$Event[],
  optionsForAllDay?: ExecuteDayTime,
) {
  const currentDate = new Date();
  const options: SendTelegramMessageOptions = {
    chat_id: process.env.TELEGRAM_CHAT_ID!,
    text: 'Today is recognized by Rebecca Black!',
    bot_token: process.env.TELEGRAM_BOT_TOKEN!,
  }
  events.forEach((event) => {
    if (event.start?.date) {
      scheduleJobForEventWithAllDay(event.start.date, optionsForAllDay);
    }
    if (event.start?.dateTime) {
      const eventDateTime = new Date(event.start.dateTime);
      if (eventDateTime < currentDate) {
        return;
      }
      scheduleJobForEventWithTimeInDay(eventDateTime, sendTelegramMessageWithFetch(options));
    }
  });
}

export {
  scheduleJobForEventWithAllDay,
  scheduleJobForEventWithTimeInDay,
  scheduleJobsForEvents,
};
