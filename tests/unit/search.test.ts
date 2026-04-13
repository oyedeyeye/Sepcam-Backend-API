import { Request, Response } from 'express';
import { searchMessages } from '../../src/controllers/public/search';
import { prisma } from '../../src/lib/prisma';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    message: {
      findMany: jest.fn()
    }
  }
}));


describe('Search Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no search keyword is provided', async () => {
    const req = { query: {} } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    await searchMessages(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Search keyword is required.' });
  });

  it('should query Prisma with LIKE equivalent for title', async () => {
    const req = { query: { keyword: 'glory' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.message.findMany as jest.Mock).mockResolvedValue([{ id: '1', title: 'The Glory of God' }]);

    await searchMessages(req, res);

    expect(prisma.message.findMany).toHaveBeenCalledWith({
      where: {
        title: {
          contains: 'glory',
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [{ id: '1', title: 'The Glory of God' }] });
  });
});
