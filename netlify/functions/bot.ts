import { config } from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { handleBotCommands } from '../../src/utils/bot-utils/botUtils';
import { TelegramMessage } from '../../src/interfaces/botInterfacses';
import { sendPostsBySchedule } from '../../src/utils/bot-utils/scheduled-posts/sendCalendarPosts';

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
  try {
    const body = JSON.parse(event.body || '{}') as TelegramMessage;
    await handleBotCommands(body.message.text, bot, body);
    await sendPostsBySchedule(bot, body.message.chat.id)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'ok' }),
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
