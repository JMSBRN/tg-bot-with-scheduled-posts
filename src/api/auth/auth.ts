import { google, Auth } from 'googleapis';
import { readFile } from 'fs/promises';
import { CredentialsForClient, credentials } from './credentials';




async function readCredentialsFile(path:string): Promise<CredentialsForClient> {
    try {
      const data = await readFile(path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading credentials file:', error);
      return undefined;
    }
  }

async function getAuthenticatedClient(
    credentials: CredentialsForClient
     ): Promise<Auth.AuthClient | Auth.Compute> {
  try {

    const authClient = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    return await authClient.getClient();
  } catch (error) {
    throw new Error('Error loading credentials: ' + (error as Error).message);
  }
}

async function rootClient(): Promise<Auth.AuthClient | Auth.Compute> {
    try {
        return await getAuthenticatedClient(credentials);
    } catch (error) {
        throw error;
    }
}

export {
    rootClient
}