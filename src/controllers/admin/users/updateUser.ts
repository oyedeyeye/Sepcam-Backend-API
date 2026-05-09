import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Admin Users']
     #swagger.summary = 'Update an administrative user'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { description: 'User ID', type: 'string', in: 'path' }
     #swagger.requestBody = {
       required: false,
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               email: { type: "string", example: "newadmin@sepcam.com" },
               password: { type: "string", example: "newpassword123" },
               role: { type: "string", example: "SUPER_ADMIN" }
             }
           }
         }
       }
     }
     #swagger.responses[200] = {
       description: 'User updated successfully',
       schema: {
         message: "User updated successfully",
         data: {
           id: "uuid",
           email: "newadmin@sepcam.com",
           role: "SUPER_ADMIN",
           createdAt: "2026-05-09T00:00:00.000Z",
           updatedAt: "2026-05-09T00:00:00.000Z"
         }
       }
     }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'User not found' }
     #swagger.responses[409] = { description: 'Email is already in use by another user' }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const { id } = req.params;
    const { email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id: id as string } });
    
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const updateData: any = {};
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: id as string },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({ message: 'User updated successfully', data: updatedUser });
  } catch (error: any) {
    if (error.code === 'P2002') {
       res.status(409).json({ message: 'Email is already in use by another user' });
       return;
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
