import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';


export const getResources = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Public API']
     #swagger.summary = 'Fetch paginated messages'
     #swagger.parameters['page'] = { description: 'Page number (default: 1)', type: 'integer' }
     #swagger.parameters['limit'] = { description: 'Items per page (default: 10)', type: 'integer' }
     #swagger.responses[200] = {
       description: 'Successfully fetched paginated messages',
       schema: {
         data: [{
           id: "uuid",
           title: "Message Title",
           messageThumbnail: "https://sepcam.blob.core.windows.net/...jpg",
           audioFile: "https://sepcam.blob.core.windows.net/...mp3",
           pdfFile: "https://sepcam.blob.core.windows.net/...pdf",
           createdAt: "2026-05-09T00:00:00.000Z",
           updatedAt: "2026-05-09T00:00:00.000Z"
         }],
         meta: { total: 100, page: 1, limit: 10 }
       }
     }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.message.count()
    ]);

    res.status(200).json({ 
      data: messages,
      meta: {
        total,
        page,
        limit
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
