import TelegramBot from 'node-telegram-bot-api';
import { CronJob } from 'cron';
import { getEvents } from '../../../api/google-calendar/calendarApiUtils';
import { GetEventsOptions } from '../../../api/google-calendar/interfaces';
import { CalendarEventForBot } from './inrerfaces';

export const sendPostsBySchedule = async (bot: TelegramBot, chatId: number) => {
  await bot.sendMessage(chatId, 'test from sendPostsBySchedule');
};

async function getEventsForBot(): Promise<CalendarEventForBot[] | undefined> {
  const options: GetEventsOptions = {
    calendarId: process.env.CALENDAR_ID,
    maxResults: 10,
    daysBefore: 0,
    daysAfter: 1000,
  };
  const events = await getEvents(options);

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


/**
 * Logic:
 * in every work day  function must check for events with posts and send message from bot to chat
 * must be bot current time
 * if current equal time from event from calendar =>  then send message
 *
 */
