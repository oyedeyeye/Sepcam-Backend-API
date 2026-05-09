import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { deleteBlobFromContainer, imageClient, uploadBlobToContainer } from '../../../services/storage';
import path from 'path';

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Admin Events']
     #swagger.summary = 'Update a church event'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.consumes = ['multipart/form-data']
     #swagger.parameters['id'] = { description: 'Event ID', type: 'string', in: 'path' }
     #swagger.requestBody = {
       required: false,
       content: {
         "multipart/form-data": {
           schema: {
             type: "object",
             properties: {
               title: { type: "string" },
               description: { type: "string" },
               date: { type: "string", format: "date-time" },
               location: { type: "string" },
               file: { type: "string", format: "binary" }
             }
           }
         }
       }
     }
     #swagger.responses[200] = {
       description: 'Event updated successfully',
       schema: {
         message: "Event updated successfully",
         data: {
           id: "uuid",
           title: "New Title",
           description: "Event description",
           date: "2026-10-10T00:00:00.000Z",
           location: "Auditorium",
           thumbnail: "event-1778321832216.jpg",
           createdAt: "2026-05-09T00:00:00.000Z",
           updatedAt: "2026-05-09T00:00:00.000Z"
         }
       }
     }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Event not found for update' }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };

    const existingEvent = await prisma.event.findUnique({
      where: { id: id as string }
    });

    if (!existingEvent) {
      res.status(404).json({ message: 'Event not found for update' });
      return;
    }

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const file = req.file as Express.Multer.File;

    if (file) {
      if (existingEvent.thumbnail) {
        await deleteBlobFromContainer(imageClient(), existingEvent.thumbnail);
      }
      
      const safeTitle = (updateData.title || existingEvent.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const ext = path.extname(file.originalname) || '.jpg';
      const thumbnailBlobName = `${safeTitle}-${Date.now()}${ext}`;
      
      await uploadBlobToContainer(imageClient(), file.path, thumbnailBlobName);
      updateData.thumbnail = thumbnailBlobName;
    }

    const updated = await prisma.event.update({
      where: { id: id as string },
      data: updateData
    });

    res.status(200).json({ message: 'Event updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
