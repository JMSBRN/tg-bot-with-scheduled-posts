import { config } from 'dotenv';
import { convertParamsToObject, getEvents } from './src/api/google-calendar/calendarApiUtils';
config();

async function main() {
    const params = convertParamsToObject('?maxResults=100&daysBefore=0&daysAfter=1000&calendarId=zakhavai@gmail.com');
    if('error' in params) {
        console.log(params);
        return;
    }
    const events = await getEvents(params);
    console.log(events?.length);

}
main();

//?=maxResults=100&daysBefore=0&daysAfter=1000
// ?maxResults=10&daysBefore=7&daysAfter=0
