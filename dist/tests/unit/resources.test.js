"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = require("../../src/controllers/public/resources");
const prisma_1 = require("../../src/lib/prisma");
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
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        prisma_1.prisma.message.findMany.mockResolvedValue([{ id: '1', title: 'msg1' }]);
        prisma_1.prisma.message.count.mockResolvedValue(1);
        await (0, resources_1.getResources)(req, res);
        expect(prisma_1.prisma.message.findMany).toHaveBeenCalledWith({
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
