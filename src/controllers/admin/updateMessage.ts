import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { deleteBlobFromContainer, audioClient, pdfClient, imageClient, uploadBlobToContainer } from '../../services/storage';
import path from 'path';

const slugifyTitle = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export const updateMessage = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Admin Messages']
     #swagger.summary = 'Update an existing Sepcam Message'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.consumes = ['multipart/form-data']
     #swagger.parameters['id'] = { description: 'Message ID', type: 'string', in: 'path' }
     #swagger.requestBody = {
       required: false,
       content: {
         "multipart/form-data": {
           schema: {
             type: "object",
             properties: {
               title: { type: "string" },
               theme: { type: "string" },
               caption: { type: "string" },
               description: { type: "string" },
               serviceTag: { type: "string" },
               youtubeLink: { type: "string" },
               preacher: { type: "string" },
               preacherThumbnail: { type: "string" },
               messageThumbnail: { type: "string", format: "binary" },
               audioFile: { type: "string", format: "binary" },
               pdfFile: { type: "string", format: "binary" }
             }
           }
         }
       }
     }
     #swagger.responses[200] = {
       description: 'Updated successfully',
       schema: {
         message: "Updated successfully",
         data: {
           id: "uuid",
           title: "Updated Title",
           messageThumbnail: "event-1778321832216.jpg",
           audioFile: "event-1778321832216.mp3",
           pdfFile: "event-1778321832216.pdf",
           createdAt: "2026-05-09T00:00:00.000Z",
           updatedAt: "2026-05-09T00:00:00.000Z"
         }
       }
     }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Message not found for update' }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };

    const existingMessage = await prisma.message.findUnique({
      where: { id: id as string }
    });

    if (!existingMessage) {
      res.status(404).json({ message: 'Message not found for update' });
      return;
    }

    const safeTitle = slugifyTitle(updateData.title || existingMessage.title);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files && files.messageThumbnail && files.messageThumbnail[0]) {
      if (existingMessage.messageThumbnail) {
        await deleteBlobFromContainer(imageClient(), existingMessage.messageThumbnail);
      }
      const ext = path.extname(files.messageThumbnail[0].originalname) || '.jpg';
      const imageBlobName = `${safeTitle}-${Date.now()}${ext}`;
      await uploadBlobToContainer(imageClient(), files.messageThumbnail[0].path, imageBlobName);
      updateData.messageThumbnail = imageBlobName;
    }

    if (files && files.audioFile && files.audioFile[0]) {
      if (existingMessage.audioFile) {
        await deleteBlobFromContainer(audioClient(), existingMessage.audioFile);
      }
      const ext = path.extname(files.audioFile[0].originalname) || '.mp3';
      const audioBlobName = `${safeTitle}-${Date.now()}${ext}`;
      await uploadBlobToContainer(audioClient(), files.audioFile[0].path, audioBlobName);
      updateData.audioFile = audioBlobName;
    }

    if (files && files.pdfFile && files.pdfFile[0]) {
      if (existingMessage.pdfFile) {
        await deleteBlobFromContainer(pdfClient(), existingMessage.pdfFile);
      }
      const ext = path.extname(files.pdfFile[0].originalname) || '.pdf';
      const pdfBlobName = `${safeTitle}-${Date.now()}${ext}`;
      await uploadBlobToContainer(pdfClient(), files.pdfFile[0].path, pdfBlobName);
      updateData.pdfFile = pdfBlobName;
    }

    const updated = await prisma.message.update({
      where: { id: id as string },
      data: updateData
    });

    res.status(200).json({ message: 'Updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
