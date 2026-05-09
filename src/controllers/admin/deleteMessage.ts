import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { deleteBlobFromContainer, audioClient, pdfClient, imageClient } from '../../services/storage';

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Admin Messages']
     #swagger.summary = 'Delete an existing Sepcam Message'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { description: 'Message ID', type: 'string', in: 'path' }
     #swagger.responses[204] = { description: 'No Content. Successfully deleted' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Message not found for deletion' }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: id as string }
    });

    if (!message) {
      res.status(404).json({ message: 'Message not found for deletion' });
      return;
    }

    if (message.audioFile) {
      await deleteBlobFromContainer(audioClient(), message.audioFile);
    }
    if (message.pdfFile) {
      await deleteBlobFromContainer(pdfClient(), message.pdfFile);
    }
    if (message.messageThumbnail) {
      await deleteBlobFromContainer(imageClient(), message.messageThumbnail);
    }

    await prisma.message.delete({
      where: { id: id as string }
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Message not found for deletion' });
      return;
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
