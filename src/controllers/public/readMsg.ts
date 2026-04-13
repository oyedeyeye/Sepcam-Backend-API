import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';


export const readMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: id as string }
    });

    if (!message) {
      res.status(404).json({ message: 'Message not found.' });
      return;
    }

    res.status(200).json({ data: message });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
