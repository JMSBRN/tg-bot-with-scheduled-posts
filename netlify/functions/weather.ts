import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';

const fetch = import('node-fetch').then(({ default: fetch }) => fetch);

const apiToken = process.env.WEATHER_API_ID;
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Berlin,de&mode=html&units=metric&lang=ru&&APPID=${apiToken}`;

const handler: Handler = async (event: HandlerEvent, cxt: HandlerContext) => {
  try {
    const apiRes = (await fetch)(apiUrl);

    if (!(await apiRes).ok) {
      const errorText = (await apiRes).text();
      throw new Error(`Weather API request failed with status ${(await apiRes).status}. Error: ${errorText}`);
    }

    const data = await (await apiRes).text();
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

