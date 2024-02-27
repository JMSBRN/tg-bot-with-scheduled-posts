import TelegramBot from 'node-telegram-bot-api';
import { CronJob } from 'cron';
import { getEvents } from '../../../api/google-calendar/calendarApiUtils';
import { GetEventsOptions } from '../../../api/google-calendar/interfaces';
import { CalendarEventForBot, DateTime, FilteredEvents } from './inrerfaces';

export const sendPostsBySchedule = async (bot: TelegramBot, chatId: number) => {
  await bot.sendMessage(chatId, 'test from sendPostsBySchedule');
};

async function getEventsFromCalendar() {
  const options: GetEventsOptions = {
    calendarId: process.env.CALENDAR_ID,
    maxResults: 10,
    daysBefore: 0,
    daysAfter: 1000,
  };
  return await getEvents(options);
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

function compareDateFromStartByDay(start: DateTime): boolean {
  const currentDay = new Date().setUTCHours(0, 0, 0, 0);
  if (!start?.date) {
    return false;
  }
  const startDay = new Date(start.date as string).setUTCHours(0, 0, 0, 0);
  return startDay === currentDay;
}

function compareDateFromStartByHour(start: DateTime): boolean {
  const now = new Date();
  const currentHour = now.setHours(now.getHours(), 0, 0, 0);

  if (!start?.dateTime) {
    return false;
  }
  const startDate = new Date(start.dateTime);
  const startHour = startDate.setHours(startDate.getHours(), 0, 0, 0);
  return currentHour === startHour;
}

export async function getEventsForBot(): Promise<FilteredEvents | undefined> {
  const events = await getEventsFromCalendar();
  if (Array.isArray(events)) {
    const newEvents: CalendarEventForBot[] = events.map((el) => {
      return {
        text: el.summary,
        start: el.start,
        end: el.end,
      };
    });
    const withDay: CalendarEventForBot[] = newEvents.filter((el) => {
      return compareDateFromStartByDay(el.start);
    });

    const withHours: CalendarEventForBot[] = newEvents.filter((el) => {
      return compareDateFromStartByHour(el.start);
    });

    return { withDay, withHours };
  }
}


export async function sendMessagesFromCalendarToTelegram(bot: TelegramBot, chatId: TelegramBot.ChatId) {
  const { withDay, withHours } = (await getEventsForBot()) as FilteredEvents;
   if(withDay.length){
    withDay.forEach((el)=>{
      if(!el.text) return;
      bot.sendMessage(chatId, el.text)
    })
   }
}

/**
 * Logic:
 * in every work day  function must check for events with posts and send message from bot to chat
 * must be bot current time
 * if current equal time from event from calendar =>  then send message
 *
 */
