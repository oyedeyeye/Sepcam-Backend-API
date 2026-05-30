import { Request, Response } from 'express';
import { calendarEvents } from '../../services/googleCalendar';

export const getUpcomingEvents = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Public API']
     #swagger.summary = 'Fetch upcoming Google Calendar events'
     #swagger.description = 'Returns a list of the next 3 upcoming church events directly from Google Calendar API.'
     #swagger.responses[200] = {
       description: 'List of Google Calendar events',
       schema: [{
         id: "event-id",
         summary: "Event Summary / Title",
         description: "Event Description",
         htmlLink: "https://calendar.google.com/...",
         start: { dateTime: "2026-10-10T10:00:00Z" },
         end: { dateTime: "2026-10-10T12:00:00Z" }
       }]
     }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const events = await calendarEvents(3);
    res.status(200).json(events);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
