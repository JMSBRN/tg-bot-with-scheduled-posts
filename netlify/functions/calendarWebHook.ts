import {
  HandlerContext,
  HandlerEvent,
  HandlerResponse,
} from '@netlify/functions';

export const handler = async (
  event: HandlerEvent,
  context: HandlerContext,
): Promise<HandlerResponse> => {
  const parsedUrl = new URL(event.rawUrl);
  const id = parsedUrl.pathname.split('/')[4];

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Calendar webhook triggered for ID: ${id}`,
    }),
  };
};
