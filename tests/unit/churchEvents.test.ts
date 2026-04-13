import { Request, Response } from 'express';
import { getChurchEvents } from '../../src/controllers/public/churchEvents';
import { prisma } from '../../src/lib/prisma';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    event: {
      findMany: jest.fn()
    }
  }
}));


describe('Church Events Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should list all events ordered by date', async () => {
    const req = {} as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.event.findMany as jest.Mock).mockResolvedValue([{ id: '1', title: 'Event 1' }]);

    await getChurchEvents(req, res);

    expect(prisma.event.findMany).toHaveBeenCalledWith({
      orderBy: { date: 'asc' }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [{ id: '1', title: 'Event 1' }] });
  });
});
