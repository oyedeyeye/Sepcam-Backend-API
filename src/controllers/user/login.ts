import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const loginUser = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Authentication']
     #swagger.summary = 'Login to receive a signed JWT token'
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               email: { type: "string", example: "admin@sepcam.com" },
               password: { type: "string", example: "password123" }
             }
           }
         }
       }
     }
     #swagger.responses[200] = {
       description: 'Successful login',
       schema: { token: 'eyJhbGciOiJIUzI1NiIsInR...' }
     }
     #swagger.responses[400] = { description: 'Email and password are required' }
     #swagger.responses[401] = { description: 'Invalid credentials' }
     #swagger.responses[500] = { description: 'Server Error' }
  */
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '1d' });

    res.status(200).json({ token });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
