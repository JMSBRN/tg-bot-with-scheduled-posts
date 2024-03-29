import TelegramBot from "node-telegram-bot-api";
import { FilteredEvents } from "../scheduled-posts/inrerfaces";
import { getEventsForBot } from "../scheduled-posts/sendCalendarPosts";
import { TelegramMessage } from "../../interfaces/botInterfaces";

 export const  handleCalendarCommand = async (bot: TelegramBot, msg: TelegramMessage) => {
   const chatId = msg.message.chat.id;
   const { withDay, withHours } = await getEventsForBot() as FilteredEvents;
   await bot.sendMessage(chatId, 'test');

   withDay.forEach(async(event)=>{
     if(!event.text) {
       return;
      }
      await bot.sendMessage(chatId, event.text!);
      console.log(event.start?.date);

   })
 };