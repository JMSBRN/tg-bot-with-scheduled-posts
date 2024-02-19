import { google, Auth } from 'googleapis';


async function getAuthenticatedClient(): Promise<
  Auth.AuthClient | Auth.Compute | Auth.OAuth2Client
> {
  const ce = process.env.CLIENT_EMAIL;
  const pk = process.env.PRIVATE_KEY;
  try {
    const authClient = new google.auth.GoogleAuth({
      credentials: {
        client_email: ce,
        private_key: pk?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    return await authClient.getClient();
  } catch (error) {
    throw new Error('Error loading credentials: ' + (error as Error).message);
  }
}

export { getAuthenticatedClient };
