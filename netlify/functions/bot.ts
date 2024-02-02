import { config } from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { handleWeatherCommand } from '../../src/utils/botUtils';

config();

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const bot = new TelegramBot(token);
const isBotWebhookExisted = bot.hasOpenWebHook();

bot.onText(/\/weather/i, (msg) => {
  handleWeatherCommand(bot, msg);
});

if (!isBotWebhookExisted) {
  const webhookUrl = 'https://jmsbrn-tg-bot.netlify.app/.netlify/functions/bot';

  bot
    .setWebHook(webhookUrl)
    .then(() => {
      console.log(`Webhook has been set to ${webhookUrl}`);
    })
    .catch((error) => {
      console.error('Error setting up webhook:', error.message);
    });
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  try {
    const body = JSON.parse(event.body || '');
    if (body.message) {
      const chatId = body.message.chat.id;
      const htmlMessage = `
      <b>Hello World!</b>
      <i>This mertetreterterterssage is formatted with HTML.</i>
  `;
      await bot.sendMessage(chatId, htmlMessage, { parse_mode: 'HTML' });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message processed successfully' }),
    };
  } catch (error) {
    console.error('Error processing Telegram update:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
export { handler };
