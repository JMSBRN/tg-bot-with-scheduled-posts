import schedule from 'node-schedule';
import { getEvents } from './src/api/google-calendar/calendarApiUtils';
import { config } from 'dotenv';
import { calendar_v3 } from 'googleapis';

config();

//   // Schedule a job to run every day at 9 AM
// const rule = new schedule.RecurrenceRule();
// // rule.dayOfWeek = [0, new schedule.Range(1, 6)];
// // rule.hour = 9;
  // // rule.minute = 0;
  //  // every second
  //  rule.second = new schedule.Range(0, 59);

  // const job = schedule.scheduleJob(rule, () => {
  //   console.log('Job running at 9 AM!');
  // });

  // // You can also stop the job if needed
  // //job.cancel();
  interface ExecuteDayTime{
    hour: number;
    minute: number;
    seconds: number
  }
  function scheduleJobForEventWithoutTime(startDateStr: string, options?: ExecuteDayTime) {
    const { hour =0, minute =0, seconds =0 } = options  || {} as ExecuteDayTime;
    const startDate = new Date(startDateStr);
    const rule = new schedule.RecurrenceRule();
    rule.year = startDate.getFullYear();
    rule.month = startDate.getMonth();
    rule.date = startDate.getDate();
    rule.hour = hour; 
    rule.minute = minute; 
    rule.second = seconds;
    const job = schedule.scheduleJob(rule, () => {
      console.log('Job executed at', new Date());
      job.cancel();
    });
     // start in midnight ?? 
  }
  
  
  function scheduleJobsForEvents(events: calendar_v3.Schema$Event[]) {
    events.forEach((event) => {
       if(event.start?.date) {
        console.log(event.start?.date);
        scheduleJobForEventWithoutTime(event.start.date);
      }
      if(event.start?.dateTime) {
         console.log(event.start?.dateTime);
         scheduleJobForEvent(new Date(event.start.dateTime));
       } else {
        return;
        // else  if event date < current date return
       }
    });
}

function scheduleJobForEvent(eventStartTime: Date) {
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [eventStartTime.getDay()];
    rule.hour = eventStartTime.getHours();
    rule.minute = eventStartTime.getMinutes();
    rule.second = eventStartTime.getSeconds();

    const job = schedule.scheduleJob(rule, () => {
        console.log('Job executed at', new Date());
        job.cancel();
    });

}

async function main() {
    const events = await getEvents({
        calendarId: process.env.CALENDAR_ID,
    });

    if (Array.isArray(events) && events.length) {
        scheduleJobsForEvents(events);
    }
}

main();

