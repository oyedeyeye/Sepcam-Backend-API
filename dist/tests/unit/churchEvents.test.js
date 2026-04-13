"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const churchEvents_1 = require("../../src/controllers/public/churchEvents");
const prisma_1 = require("../../src/lib/prisma");
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
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        prisma_1.prisma.event.findMany.mockResolvedValue([{ id: '1', title: 'Event 1' }]);
        await (0, churchEvents_1.getChurchEvents)(req, res);
        expect(prisma_1.prisma.event.findMany).toHaveBeenCalledWith({
            orderBy: { date: 'asc' }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: [{ id: '1', title: 'Event 1' }] });
    });
});
