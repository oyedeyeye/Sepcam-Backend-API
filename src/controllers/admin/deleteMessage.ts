import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';


export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // TODO: Depending on the requirements, we should optionally delete the tied Azure Blobs.
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
