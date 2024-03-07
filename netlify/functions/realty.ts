import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';
import realtyJson from '../../realty-data.json';

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  try {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
      
      body: JSON.stringify({ message: 'Success', realty: realtyJson }),
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
