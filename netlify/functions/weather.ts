import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';
import fetch from 'node-fetch';

const apiToken = process.env.WEATHER_API_ID;
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Berlin,de&mode=html&units=metric&lang=ru&&APPID=${apiToken}`;

console.log(apiUrl);

const handler: Handler = async (event: HandlerEvent, cxt: HandlerContext) => {
  try {
    const apiRes = await fetch(apiUrl);

    if (!apiRes.ok) {
      throw new Error(`Weather API request failed with status ${apiRes.status}`);
    }

    const data = await apiRes.text();
    return {
      statusCode: 200,
      headers: { 'Content-type': 'text/html' },
      body: data,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

export { handler };