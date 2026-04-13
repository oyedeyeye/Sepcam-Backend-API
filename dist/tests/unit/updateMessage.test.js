"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateMessage_1 = require("../../src/controllers/admin/updateMessage");
const prisma_1 = require("../../src/lib/prisma");
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
        const req = { params: { id: '123' }, body: { title: 'Updated Title' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        prisma_1.prisma.message.update.mockResolvedValue({ id: '123', title: 'Updated Title' });
        await (0, updateMessage_1.updateMessage)(req, res);
        expect(prisma_1.prisma.message.update).toHaveBeenCalledWith({
            where: { id: '123' },
            data: { title: 'Updated Title' }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Updated successfully', data: { id: '123', title: 'Updated Title' } });
    });
});
