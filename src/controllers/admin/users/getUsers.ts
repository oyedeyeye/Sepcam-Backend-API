import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Admin Users']
     #swagger.summary = 'List all administrative users'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = {
       description: 'List of users',
       schema: {
         data: [{
           id: "uuid",
           email: "admin@sepcam.com",
           role: "ADMIN",
           createdAt: "2026-05-09T00:00:00.000Z",
           updatedAt: "2026-05-09T00:00:00.000Z"
         }]
       }
     }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ data: users });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
