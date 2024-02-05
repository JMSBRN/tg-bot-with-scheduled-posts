import { config } from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { handleWeatherCommand } from '../../src/utils/botUtils';
import { TelegramMessage } from '../../src/interfaces/botInterfacses';

config();

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const bot = new TelegramBot(token);
const isBotWebhookExisted = bot.hasOpenWebHook();


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
  const regExpWeatheCommand:RegExp = /\/weather/i;
  try {
    const body = JSON.parse(event.body || '{}') as TelegramMessage;
    if (regExpWeatheCommand.test(body.message.text)) {
       await handleWeatherCommand(bot, body)
      }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'fok' }),
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
