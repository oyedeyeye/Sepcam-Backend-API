import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';


export const searchMessages = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Public API']
     #swagger.summary = 'Search messages by keyword'
     #swagger.parameters['keyword'] = { description: 'Search term for title or theme', type: 'string' }
     #swagger.responses[200] = {
       description: 'Search results',
       schema: {
         data: [{
           id: "uuid",
           title: "Message Title",
           messageThumbnail: "https://sepcam.blob.core.windows.net/...jpg",
           audioFile: "https://sepcam.blob.core.windows.net/...mp3",
           pdfFile: "https://sepcam.blob.core.windows.net/...pdf",
           createdAt: "2026-05-09T00:00:00.000Z",
           updatedAt: "2026-05-09T00:00:00.000Z"
         }]
       }
     }
     #swagger.responses[400] = { description: 'Keyword is required' }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const keyword = req.query.keyword as string;
    if (!keyword) {
      res.status(400).json({ message: 'Search keyword is required.' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: {
        title: {
          contains: keyword
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ data: messages });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
