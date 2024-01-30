import { config } from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

config();
const token = process.env.TELEGRAM_BOT_TOKEN || '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

export async function handler(event: any, context: any) {
  try {
    const body = JSON.parse(event.body);

    if (
      body &&
      body.message &&
      body.message.text &&
      body.message.text.toLowerCase().includes('/testcommand')
    ) {
      const chatId = body.message.chat.id;
      await bot.sendMessage(chatId, 'This is a response to the /testcommand!');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Processed successfully' }),
    };
  } catch (error) {
    console.error('Error handling Telegram message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}
