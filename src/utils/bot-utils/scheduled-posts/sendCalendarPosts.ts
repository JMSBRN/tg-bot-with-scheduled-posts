import TelegramBot from "node-telegram-bot-api";

export const sendPostsBySchedule = async (bot: TelegramBot, chatId: number) => {
    await bot.sendMessage(chatId, 'test from sendPostsBySchedule');
};

