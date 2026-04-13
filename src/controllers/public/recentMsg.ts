import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';


export const getRecentMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await prisma.message.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!message) {
      res.status(404).json({ message: 'No messages found.' });
      return;
    }

    res.status(200).json({ data: message });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
