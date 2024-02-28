import TelegramBot from 'node-telegram-bot-api';
import { TelegramMessage } from '../../../interfaces/botInterfacses';

const START_MENU_URL = 'https://jmsbrn-tg-bot.netlify.app/';

const sendStartMenu = async (bot: TelegramBot, chatId: number) => {
    const keyboardButtons = Array.from({ length: 3 }, () => [
        { text: 'Open web app for testing', web_app: { url: START_MENU_URL } }
      ]);

  await bot.sendMessage(chatId, 'Welcome to the start menu', {
    reply_markup: {
      keyboard: keyboardButtons,
      resize_keyboard: false,
    },
  });
};

const sendMarkdownContent = async (bot: TelegramBot, chatId: number) => {
  const markdownContent = `
    <b>Start Menu (Develop Mode)</b>

    Here are some commands you can try:
    - <code>/weather</code> - Get current weather information.
    - <code>/someothercommand</code> - Description of another command.
  `;

  await bot.sendMessage(chatId, markdownContent, {
    parse_mode: 'HTML',
  });
};

export const handleStartCommand = async (bot: TelegramBot, msg: TelegramMessage) => {
  try {
    const chatId = msg.message.chat.id;

    await sendStartMenu(bot, chatId);
    await sendMarkdownContent(bot, chatId);
  } catch (error) {
    console.error('Error handling start command:', (error as Error).message);
  }
};
  