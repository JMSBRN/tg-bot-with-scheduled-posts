import TelegramBot from 'node-telegram-bot-api';
import { handleStartCommand } from './startCommand';
import { handleHelpCommand } from './helpCommand';
import { handleWeatherCommand } from './weatherCommand';
import { handleCalendarCommand } from './calendarComand';
import { TelegramMessage } from '../../interfaces/botInterfacses';
import { ResponsForSendMessageWithFetch, SendTelegramMessageOptions } from './interfaces';
import schedule from 'node-schedule';

export const handleBotCommands = async (text: string, bot:TelegramBot, msg:TelegramMessage) => {
  const regExpWeatherCommand: RegExp = /\/weather/i;
  const regExpStartCommand: RegExp = /\/start/i;
  const regExpHelpCommand: RegExp = /\/help/i;
  const regExpCalendarCommand: RegExp = /\/calendar/i;

  if (regExpWeatherCommand.test(text)) {
    await handleWeatherCommand(bot, msg);
  } else if (regExpStartCommand.test(text)) {
    await handleStartCommand(bot, msg);
  } else if (regExpHelpCommand.test(text)) {
    await handleHelpCommand(bot, msg);
  } else if (regExpCalendarCommand.test(text)) {
    await handleCalendarCommand(bot, msg);
  } else {
    return 'Unknown command';
  }
   // refactor ??
};


export async function sendTelegramMessageWithFetch (options: SendTelegramMessageOptions): Promise<ResponsForSendMessageWithFetch> {
  const { chat_id, text, bot_token } = options;
  try {
    const response = await fetch('https://api.telegram.org/bot' + bot_token + '/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id,
        text,
      })  
    });
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    return  { ok: response.ok };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
