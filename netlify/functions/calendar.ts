import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';

const handler: Handler = async (event: HandlerEvent, cxt: HandlerContext) => {
  try {
    return {
      statusCode: 200,
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ test: 'test calendar' }),
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
