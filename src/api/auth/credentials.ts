import { config } from 'dotenv';
import { Auth } from 'googleapis';


config();
export type CredentialsForClient = Auth.JWTInput | Auth.ExternalAccountClientOptions | undefined;
const credentials: any   = {
  web: {
    client_id: process.env.CLIENT_ID,
    project_id: process.env.PROJECT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_secret: process.env.CLIENT_SECRET,
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVAT_KEY,
    redirect_uris: [process.env.REDIRECT_URIS],
  },
  client_email: process.env.CLIENT_EMAIL,
  private_key: process.env.PRIVAT_KEY,
};

export { credentials };


