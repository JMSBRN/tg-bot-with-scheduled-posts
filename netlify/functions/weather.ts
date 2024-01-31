import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';

const handler: Handler = async (event: HandlerEvent, cxt: HandlerContext) => {
  const apiToken = process.env.WEATHER_API_ID;
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const currentParams = JSON.stringify({ city: 'london', country: 'gb', mode: 'html', units: 'metric', lang: 'en' });
  const { city, country, mode, units, lang } = JSON.parse(event.body || currentParams);
  const queryParams = new URLSearchParams({
    q: `${city},${country}`,
    mode,
    units,
    lang,
    APPID: apiToken || '',
  });

  try {
    const apiRes = await fetch(`${apiUrl}?${queryParams}`);

    if (!apiRes.ok) {
      const errorText = apiRes.text();
      throw new Error(
        `Weather API request failed with status ${apiRes.status}. Error: ${errorText}`,
      );
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
