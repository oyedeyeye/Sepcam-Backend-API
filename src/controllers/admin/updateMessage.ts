import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';


export const updateMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await prisma.message.update({
      where: { id: id as string },
      data: updateData
    });

    res.status(200).json({ message: 'Updated successfully', data: updated });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Message not found for update' });
      return;
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
