import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';


export const getChurchEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });

    res.status(200).json({ data: events });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
