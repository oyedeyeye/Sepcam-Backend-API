import { Request, Response } from 'express';
import { deleteMessage } from '../../src/controllers/admin/deleteMessage';
import { prisma } from '../../src/lib/prisma';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    message: {
      delete: jest.fn()
    }
  }
}));


describe('Delete Message Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a message by ID', async () => {
    const req = { params: { id: '123' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

    (prisma.message.delete as jest.Mock).mockResolvedValue({ id: '123' });

    await deleteMessage(req, res);

    expect(prisma.message.delete).toHaveBeenCalledWith({
      where: { id: '123' }
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
