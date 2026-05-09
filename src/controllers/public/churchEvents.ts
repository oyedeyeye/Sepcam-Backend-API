import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';


export const getChurchEvents = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Public API']
     #swagger.summary = 'Fetch all church events'
     #swagger.description = 'Returns a list of all upcoming and past church events, sorted by date.'
     #swagger.responses[200] = {
       description: 'List of events',
       schema: {
         data: [{
           id: "uuid",
           title: "Event Title",
           description: "Event Description",
           date: "2026-10-10T00:00:00.000Z",
           location: "Church Auditorium",
           thumbnail: "https://sepcam.blob.core.windows.net/...jpg",
           createdAt: "2026-05-09T00:00:00.000Z",
           updatedAt: "2026-05-09T00:00:00.000Z"
         }]
       }
     }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });

    res.status(200).json({ data: events });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
