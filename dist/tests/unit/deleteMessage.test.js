"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deleteMessage_1 = require("../../src/controllers/admin/deleteMessage");
const prisma_1 = require("../../src/lib/prisma");
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
        const req = { params: { id: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
        prisma_1.prisma.message.delete.mockResolvedValue({ id: '123' });
        await (0, deleteMessage_1.deleteMessage)(req, res);
        expect(prisma_1.prisma.message.delete).toHaveBeenCalledWith({
            where: { id: '123' }
        });
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });
});
