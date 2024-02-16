import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';
import townsData from '../../famous-towns.json';

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success', towns: townsData }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

export { handler };
