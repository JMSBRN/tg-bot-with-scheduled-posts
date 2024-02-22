import TelegramBot from "node-telegram-bot-api";
import { CronJob } from 'cron';


export const sendPostsBySchedule = async (bot: TelegramBot, chatId: number) => {
    await bot.sendMessage(chatId, 'test from sendPostsBySchedule');
};



const job = new CronJob(
    '* * * * *', // 0 9 * * 1-5 every work day in 9-00 am
	function () {
		console.log('You will see this message every second');
	}, // onTick
	null, // onComplete
	true, // start
	'Belarus/Minsk'
);

job