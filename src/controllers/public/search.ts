import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';


export const searchMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const keyword = req.query.keyword as string;
    if (!keyword) {
      res.status(400).json({ message: 'Search keyword is required.' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: {
        title: {
          contains: keyword
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ data: messages });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
