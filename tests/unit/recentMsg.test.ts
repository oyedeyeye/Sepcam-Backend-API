import { Request, Response } from 'express';
import { getRecentMessage } from '../../src/controllers/public/recentMsg';
import { prisma } from '../../src/lib/prisma';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    message: {
      findFirst: jest.fn()
    }
  }
}));


describe('Get Recent Message Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the most recent message', async () => {
    const req = {} as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.message.findFirst as jest.Mock).mockResolvedValue({ id: '1', title: 'Recent Msg' });

    await getRecentMessage(req, res);

    expect(prisma.message.findFirst).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: { id: '1', title: 'Recent Msg' } });
  });
});
