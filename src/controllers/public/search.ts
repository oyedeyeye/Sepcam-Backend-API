import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';


export const searchMessages = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Public API']
     #swagger.summary = 'Search messages by keyword'
     #swagger.parameters['keyword'] = { description: 'Search term for title or theme', type: 'string' }
     #swagger.parameters['page'] = { description: 'Page number (default: 1)', type: 'integer' }
     #swagger.parameters['limit'] = { description: 'Items per page (default: 10)', type: 'integer' }
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
         }],
         meta: { total: 10, page: 1, limit: 10 }
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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: {
          title: {
            contains: keyword
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.message.count({
        where: {
          title: {
            contains: keyword
          }
        }
      })
    ]);

    const accountMatch = (process.env.AZURE_STORAGE_CONNECTION_STRING || '').match(/AccountName=([^;]+)/);
    const accountName = accountMatch ? accountMatch[1] : 'sepcamwebadmin001';
    
    const audioContainer = process.env.AZURE_AUDIO_CONTAINER || 'audios';
    const pdfContainer = process.env.AZURE_PDF_CONTAINER || 'pdfs';
    const imageContainer = process.env.AZURE_IMAGE_CONTAINER || 'images';

    const messagesWithLinks = messages.map((message) => {
      const audioFileLink = message.audioFile ? `https://${accountName}.blob.core.windows.net/${audioContainer}/${message.audioFile}` : '';
      const pdfFileLink = message.pdfFile ? `https://${accountName}.blob.core.windows.net/${pdfContainer}/${message.pdfFile}` : '';
      const messageThumbnailLink = message.messageThumbnail ? `https://${accountName}.blob.core.windows.net/${imageContainer}/${message.messageThumbnail}` : '';
      return {
        ...message,
        audioFileLink,
        pdfFileLink,
        messageThumbnailLink
      };
    });

    res.status(200).json({ 
      data: messagesWithLinks,
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
