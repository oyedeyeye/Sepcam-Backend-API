import { Request, Response } from 'express';
import { loginUser } from '../../src/controllers/user/login';
import { prisma } from '../../src/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}));


jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Login Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should issue a token for valid credentials', async () => {
    const req = { body: { email: 'admin@test.com', password: 'password123' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1', email: 'admin@test.com', password: 'hashedpassword', role: 'ADMIN' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('valid-jwt-token');

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: 'valid-jwt-token' });
  });

  it('should return 401 for invalid credentials', async () => {
    const req = { body: { email: 'admin@test.com', password: 'wrong' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
