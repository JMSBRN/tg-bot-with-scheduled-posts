import TelegramBot from "node-telegram-bot-api";
import { TelegramMessage } from "../../../interfaces/botInterfacses";

const HELP_MENU_URL = 'https://jmsbrn-tg-bot.netlify.app/';

const sendHelpMenu = async (bot: TelegramBot, chatId: number) => {
    const keyboardButtons = Array.from({ length: 3 }, () => [
        { text: 'Open web app for testing', web_app: { url: HELP_MENU_URL } }
      ]);
  
    await bot.sendMessage(chatId, 'Welcome to the help menu', {
      reply_markup: {
        keyboard: keyboardButtons,
        resize_keyboard: true,
      },
    });
  };
  
  const sendMarkdownContent = async (bot: TelegramBot, chatId: number) => {
    const markdownContent = `
      <b>Help Menu (Develop Mode)</b>
  
      Here are some commands you can try:
      - <code>/weather</code> - Get current weather information.
      - <code>/someothercommand</code> - Description of another command.
    `;
  
    await bot.sendMessage(chatId, markdownContent, {
      parse_mode: 'HTML',
    });
  };
  
  export const handleHelpCommand = async (bot: TelegramBot, msg: TelegramMessage) => {
    try {
      const chatId = msg.message.chat.id;
  
      await sendHelpMenu(bot, chatId);
      await sendMarkdownContent(bot, chatId);
    } catch (error) {
      console.error('Error handling help command:', (error as Error).message);
    }
  };