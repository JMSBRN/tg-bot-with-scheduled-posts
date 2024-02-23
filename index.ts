import { convertParamsToObject, getEvents } from "./src/api/google-calendar/calendarApiUtils";
import { config } from 'dotenv';
config();

async function main() {
    const params = convertParamsToObject('?maxResults=100&daysBefore=0&daysAfter=1000');
    if('error' in params) {
        console.log(params);
        return;
    }
    const events = await getEvents(params, 'zakhavai@gmail.com');
    console.log(events?.length);

}
main();

//?=maxResults=100&daysBefore=0&daysAfter=1000
// ?maxResults=10&daysBefore=7&daysAfter=0