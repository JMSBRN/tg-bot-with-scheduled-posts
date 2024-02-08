import { google } from 'googleapis';
import { config } from 'dotenv';
import { HandlerContext, HandlerEvent } from '@netlify/functions';

config();

exports.handler = async (event:HandlerEvent, context: HandlerContext) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL
    );

    // Define scopes for Google Calendar API
    const scopes = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar'
    ];

    // Generate authentication URL
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // 'offline' to get refresh token
        scope: scopes
    });

    // Check if the request path matches the redirect URL
    if (event.queryStringParameters && event.queryStringParameters.code) {
        const code = event.queryStringParameters.code;
        try {
            const { tokens } = await oauth2Client.getToken(code);
            // Set tokens to OAuth2 client
            if (tokens.access_token) {
                oauth2Client.setCredentials({
                    access_token: tokens.access_token
                });
            }

            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            const response = await calendar.events.list({
                calendarId: process.env.CALENDAR_ID,
                timeMin: new Date().toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime'
            });

            const events = response.data.items;
            return {
                statusCode: 200,
                body: JSON.stringify(events)
            };
        } catch (err) {
            console.error('Error:', err);
            return {
                statusCode: 500,
                body: 'Error fetching events. Please try again.'
            };
        }
    } else {
        // Redirect user to authentication URL
        return {
            statusCode: 301,
            headers: {
                'Location': authUrl
            },
            body: ''
        };
    }
}
