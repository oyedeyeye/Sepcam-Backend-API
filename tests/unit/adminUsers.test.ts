import { Request, Response } from 'express';
import { prisma } from '../../src/lib/prisma';
import bcrypt from 'bcrypt';
import { createUser } from '../../src/controllers/admin/users/createUser';
import { getUsers } from '../../src/controllers/admin/users/getUsers';
import { updateUser } from '../../src/controllers/admin/users/updateUser';
import { deleteUser } from '../../src/controllers/admin/users/deleteUser';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword')
}));

describe('Admin Users Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const req = { body: { email: 'test@sepcam.com', password: 'pwd', role: 'ADMIN' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: '1', email: 'test@sepcam.com' });

      await createUser(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('pwd', 'salt');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email: 'test@sepcam.com', password: 'hashedPassword', role: 'ADMIN' },
        select: expect.any(Object)
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User created successfully' }));
    });

    it('should return 409 if user exists', async () => {
      const req = { body: { email: 'test@sepcam.com', password: 'pwd' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const req = {} as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: '1', email: 'test@sepcam.com' }]);

      await getUsers(req, res);

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: [{ id: '1', email: 'test@sepcam.com' }] });
    });
  });

  describe('updateUser', () => {
    it('should update user and hash new password', async () => {
      const req = { params: { id: '1' }, body: { password: 'newPwd' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      (prisma.user.update as jest.Mock).mockResolvedValue({ id: '1', email: 'test@sepcam.com' });

      await updateUser(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPwd', 'salt');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { password: 'hashedPassword' },
        select: expect.any(Object)
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

      await deleteUser(req, res);

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
