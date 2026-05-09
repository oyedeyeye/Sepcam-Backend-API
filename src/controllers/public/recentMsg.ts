import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';


export const getRecentMessage = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Public API']
     #swagger.summary = 'Fetch the most recent message'
     #swagger.responses[200] = {
       description: 'Most recent message',
       schema: {
         data: {
           id: "uuid",
           title: "Message Title",
           messageThumbnail: "https://sepcam.blob.core.windows.net/...jpg",
           audioFile: "https://sepcam.blob.core.windows.net/...mp3",
           pdfFile: "https://sepcam.blob.core.windows.net/...pdf",
           createdAt: "2026-05-09T00:00:00.000Z",
           updatedAt: "2026-05-09T00:00:00.000Z"
         }
       }
     }
     #swagger.responses[404] = { description: 'No messages found' }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const message = await prisma.message.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!message) {
      res.status(404).json({ message: 'No messages found.' });
      return;
    }

    res.status(200).json({ data: message });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
