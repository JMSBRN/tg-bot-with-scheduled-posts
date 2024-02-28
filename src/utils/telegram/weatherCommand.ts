import TelegramBot from 'node-telegram-bot-api';
import { TelegramMessage } from '../../../interfaces/botInterfacses';
import { getEventsForBot } from '../scheduled-posts/sendCalendarPosts';
import { FilteredEvents } from '../scheduled-posts/inrerfaces';
import { CronJob } from 'cron';

const sendWeatherInfo = async (bot: TelegramBot, chatId: number) => {
    await bot.sendMessage(chatId, '🏝️✈️🍹☀️🏖️', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'You can now get the current weather from most popular cities',
              url: 'https://jmsbrn-tg-bot.netlify.app/',
            },
          ],
        ],
        resize_keyboard: true,
      },
    });
  };
  
  const sendWeatherCommAndInfo = async (bot: TelegramBot, chatId: number) => {
    const htmlContent = `
      <blockquote>
        Or you can choose your city\n
        with the command
      </blockquote>
      <code>/weather --your city--</code>
    `;
  
    await bot.sendMessage(chatId, htmlContent, {
      parse_mode: 'HTML',
    });
  };
  

  export const handleWeatherCommand = async (bot: TelegramBot, msg: TelegramMessage) => {
    try {
      const chatId = msg.message.chat.id;
      
      await sendWeatherInfo(bot, chatId);
      await sendWeatherCommAndInfo(bot, chatId);
    } catch (error) {
      console.error('Error handling weather command:', (error as Error).message);
    }
  };

