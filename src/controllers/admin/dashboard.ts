import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Admin Dashboard']
     #swagger.summary = 'Fetch backwards-compatible dashboard content listing'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = {
       description: 'Successfully fetched dashboard content',
       schema: {
         entities: [{
           rowKey: "uuid",
           title: "Message Title",
           theme: "Theme",
           date: "2026-05-09T00:00:00.000Z"
         }]
       }
     }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const entities = messages.map((message) => ({
      rowKey: message.id,
      title: message.title,
      theme: message.theme,
      date: message.createdAt
    }));

    res.status(200).json({ entities });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
