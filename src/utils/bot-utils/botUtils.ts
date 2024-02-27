import TelegramBot from 'node-telegram-bot-api';
import { TelegramMessage } from '../../interfaces/botInterfacses';
import { handleStartCommand } from './bot-commands/startCommand';
import { handleHelpCommand } from './bot-commands/helpCommand';
import { handleWeatherCommand } from './bot-commands/weatherCommand';
import { handleCalendarCommand } from './bot-commands/calendarComand';

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
};

