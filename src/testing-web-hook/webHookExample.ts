import { HandlerEvent, HandlerContext, HandlerResponse } from "@netlify/functions";
import { getEvents } from "../api/google-calendar/calendarApiUtils";

  
  const handler = async (
    event: HandlerEvent,
    context: HandlerContext,
  ): Promise<HandlerResponse> => {
    const parsedUrl = new URL(event.rawUrl);
    const id = parsedUrl.pathname.split('/')[4];
   
    const events = await getEvents({
      calendarId: process.env.CALENDAR_ID,
    });
     if(Array.isArray(events) && events.length) {
      const trigeredEvent = events?.filter((el) => el.id === id);
  
      trigeredEvent.forEach(async (event) => {
        await fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/sendMessage', {
          method: 'POST',
      headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
        text: event.summary,
  
      }),
    });
  
      })
      
   
  }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'ok',
      }),
    };
  };
  
  export {
    handler
  }