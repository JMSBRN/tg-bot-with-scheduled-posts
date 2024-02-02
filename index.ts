import { config } from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

config();

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/weather/i, (msg) => {
  var chatId = msg.chat.id;
  bot.sendMessage(chatId, '🏝️✈️🍹☀️🏖️', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'you can now get  current weather from most popular cities',
            url: 'https://jmsbrn-tg-bot.netlify.app/',
          },
        ],
      ],
      resize_keyboard: true,
    },
  });
  const markdownContent = `
  <blockquote>
     Or you can choose your city\n
     with command
  </blockquote>
  <code>/weather --your city--</code>
  `;
  bot.sendMessage(chatId, markdownContent, {
    parse_mode: 'HTML',
  });
});
