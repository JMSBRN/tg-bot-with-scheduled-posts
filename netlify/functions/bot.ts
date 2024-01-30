import { config } from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

config();
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN || '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
  
bot.on('message', (msg) => {
    bot.sendMessage(msg.chat.id, 'test')  
})