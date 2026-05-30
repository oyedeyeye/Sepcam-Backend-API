import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const CAL_ID = process.env.CAL_ID || '';
const CAL_API = process.env.CAL_API || '';

export const calendarEvents = async (NO_OF_EVENTS = 3): Promise<any[]> => {
  if (!CAL_ID || !CAL_API) {
    console.error('Google Calendar credentials not configured in environment.');
    return [];
  }

  const calendar = google.calendar({ version: 'v3', auth: CAL_API });

  try {
    const result = await calendar.events.list({
      calendarId: CAL_ID,
      timeMin: new Date().toISOString(),
      maxResults: NO_OF_EVENTS,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return result.data.items || [];
  } catch (error: any) {
    console.error('Error retrieving Google Calendar events:', error.message);
    return [];
  }
};
