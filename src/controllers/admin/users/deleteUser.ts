import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Admin Users']
     #swagger.summary = 'Delete an administrative user'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { description: 'User ID', type: 'string', in: 'path' }
     #swagger.responses[204] = { description: 'No Content. Successfully deleted' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'User not found for deletion' }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: { id: id as string }
    });

    if (!existingUser) {
      res.status(404).json({ message: 'User not found for deletion' });
      return;
    }

    await prisma.user.delete({
      where: { id: id as string }
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
