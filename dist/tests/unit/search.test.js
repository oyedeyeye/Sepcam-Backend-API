"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../src/controllers/public/search");
const prisma_1 = require("../../src/lib/prisma");
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
        const req = { query: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await (0, search_1.searchMessages)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Search keyword is required.' });
    });
    it('should query Prisma with LIKE equivalent for title', async () => {
        const req = { query: { keyword: 'glory' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        prisma_1.prisma.message.findMany.mockResolvedValue([{ id: '1', title: 'The Glory of God' }]);
        await (0, search_1.searchMessages)(req, res);
        expect(prisma_1.prisma.message.findMany).toHaveBeenCalledWith({
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
