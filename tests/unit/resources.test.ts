import { Request, Response } from 'express';
import { getResources } from '../../src/controllers/public/resources';
import { prisma } from '../../src/lib/prisma';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    message: {
      findMany: jest.fn(),
      count: jest.fn()
    }
  }
}));


describe('Get Resources Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated resources with metadata', async () => {
    const req = {
      query: { page: '1', limit: '10' }
    } as unknown as Request;
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (prisma.message.findMany as jest.Mock).mockResolvedValue([{ id: '1', title: 'msg1' }]);
    (prisma.message.count as jest.Mock).mockResolvedValue(1);

    await getResources(req, res);

    expect(prisma.message.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ id: '1', title: 'msg1' }],
      meta: {
        total: 1,
        page: 1,
        limit: 10
      }
    });
  });
});
