import { Request, Response } from 'express';
import { readMessage } from '../../src/controllers/public/readMsg';
import { prisma } from '../../src/lib/prisma';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    message: {
      findUnique: jest.fn()
    }
  }
}));


describe('Read Message Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch message by id', async () => {
    const req = { params: { id: '123' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.message.findUnique as jest.Mock).mockResolvedValue({ id: '123', title: 'Read Msg' });

    await readMessage(req, res);

    expect(prisma.message.findUnique).toHaveBeenCalledWith({
      where: { id: '123' }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: { id: '123', title: 'Read Msg' } });
  });

  it('should return 404 if not found', async () => {
    const req = { params: { id: '999' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.message.findUnique as jest.Mock).mockResolvedValue(null);

    await readMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Message not found.' });
  });
});
