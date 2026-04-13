"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recentMsg_1 = require("../../src/controllers/public/recentMsg");
const prisma_1 = require("../../src/lib/prisma");
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
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        prisma_1.prisma.message.findFirst.mockResolvedValue({ id: '1', title: 'Recent Msg' });
        await (0, recentMsg_1.getRecentMessage)(req, res);
        expect(prisma_1.prisma.message.findFirst).toHaveBeenCalledWith({
            orderBy: { createdAt: 'desc' }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: { id: '1', title: 'Recent Msg' } });
    });
});
