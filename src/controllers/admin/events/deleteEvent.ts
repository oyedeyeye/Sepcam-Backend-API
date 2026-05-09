import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { deleteBlobFromContainer, imageClient } from '../../../services/storage';

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Admin Events']
     #swagger.summary = 'Delete a church event'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { description: 'Event ID', type: 'string', in: 'path' }
     #swagger.responses[204] = { description: 'No Content. Successfully deleted' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Event not found for deletion' }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const { id } = req.params;

    const existingEvent = await prisma.event.findUnique({
      where: { id: id as string }
    });

    if (!existingEvent) {
      res.status(404).json({ message: 'Event not found for deletion' });
      return;
    }

    if (existingEvent.thumbnail) {
      await deleteBlobFromContainer(imageClient(), existingEvent.thumbnail);
    }

    await prisma.event.delete({
      where: { id: id as string }
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
