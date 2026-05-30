import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';


export const readMessage = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Public API']
     #swagger.summary = 'Fetch a specific message by ID'
     #swagger.parameters['id'] = { description: 'Message ID', type: 'string', in: 'path' }
     #swagger.responses[200] = {
       description: 'Message details',
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
     #swagger.responses[404] = { description: 'Message not found' }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: id as string }
    });

    if (!message) {
      res.status(404).json({ message: 'Message not found.' });
      return;
    }

    const accountMatch = (process.env.AZURE_STORAGE_CONNECTION_STRING || '').match(/AccountName=([^;]+)/);
    const accountName = accountMatch ? accountMatch[1] : 'sepcamwebadmin001';
    
    const audioContainer = process.env.AZURE_AUDIO_CONTAINER || 'audios';
    const pdfContainer = process.env.AZURE_PDF_CONTAINER || 'pdfs';
    const imageContainer = process.env.AZURE_IMAGE_CONTAINER || 'images';

    const audioFileLink = message.audioFile ? `https://${accountName}.blob.core.windows.net/${audioContainer}/${message.audioFile}` : '';
    const pdfFileLink = message.pdfFile ? `https://${accountName}.blob.core.windows.net/${pdfContainer}/${message.pdfFile}` : '';
    const messageThumbnailLink = message.messageThumbnail ? `https://${accountName}.blob.core.windows.net/${imageContainer}/${message.messageThumbnail}` : '';

    const messageWithLinks = {
      ...message,
      audioFileLink,
      pdfFileLink,
      messageThumbnailLink
    };

    res.status(200).json({ data: messageWithLinks });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
