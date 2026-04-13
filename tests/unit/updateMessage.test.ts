import { Request, Response } from 'express';
import { updateMessage } from '../../src/controllers/admin/updateMessage';
import { prisma } from '../../src/lib/prisma';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    message: {
      update: jest.fn()
    }
  }
}));


describe('Update Message Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update message details based on param id', async () => {
    const req = { params: { id: '123' }, body: { title: 'Updated Title' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.message.update as jest.Mock).mockResolvedValue({ id: '123', title: 'Updated Title' });

    await updateMessage(req, res);

    expect(prisma.message.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: { title: 'Updated Title' }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Updated successfully', data: { id: '123', title: 'Updated Title' } });
  });
});
