"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readMsg_1 = require("../../src/controllers/public/readMsg");
const prisma_1 = require("../../src/lib/prisma");
jest.mock('../../src/lib/prisma', () => ({
    prisma: {
        message: {
            findUnique: jest.fn()
        }
    }
}));
describe('Read Message Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should fetch message by id', async () => {
        const req = { params: { id: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        prisma_1.prisma.message.findUnique.mockResolvedValue({ id: '123', title: 'Read Msg' });
        await (0, readMsg_1.readMessage)(req, res);
        expect(prisma_1.prisma.message.findUnique).toHaveBeenCalledWith({
            where: { id: '123' }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: { id: '123', title: 'Read Msg' } });
    });
    it('should return 404 if not found', async () => {
        const req = { params: { id: '999' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        prisma_1.prisma.message.findUnique.mockResolvedValue(null);
        await (0, readMsg_1.readMessage)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Message not found.' });
    });
});
