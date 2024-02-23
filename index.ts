// import { config } from 'dotenv';
// import { convertParamsToObject, getEvents } from './src/api/google-calendar/calendarApiUtils';
// config();

// async function main() {
//     const params = convertParamsToObject('?maxResults=100&daysBefore=0&daysAfter=1000&calendarId=zakhavai@gmail.com');
//     if('error' in params) {
//         console.log(params);
//         return;
//     }
//     const events = await getEvents(params);
//     console.log(events?.length);

// }
// main();

//?=maxResults=100&daysBefore=0&daysAfter=1000
// ?maxResults=10&daysBefore=7&daysAfter=0


async function fetchCalendarData() {
    try {
      const url = 'https://jmsbrn-tg-bot.netlify.app/.netlify/functions/calendar?calendarId=zakhavai@gmail.com&daysBefore=0&daysAfter=1000&maxResults=100';
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  }
  
  fetchCalendarData();
