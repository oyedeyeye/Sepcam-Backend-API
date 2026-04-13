"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uploadMessage_1 = require("../../src/controllers/admin/uploadMessage");
const storage_1 = require("../../src/services/storage");
const prisma_1 = require("../../src/lib/prisma");
jest.mock('../../src/services/storage');
jest.mock('../../src/lib/prisma', () => ({
    prisma: {
        message: {
            create: jest.fn()
        }
    }
}));
describe('Upload Message Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should slugify the title for blobs and save to database', async () => {
        const req = {
            body: {
                title: 'The Glory of God',
                theme: 'Faith',
                serviceTag: 'SundayService'
            },
            files: {
                audioFile: [{ originalname: 'audio.mp3', path: '/tmp/audio123.mp3' }],
                pdfFile: [{ originalname: 'doc.pdf', path: '/tmp/doc123.pdf' }]
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        storage_1.uploadBlobToContainer.mockResolvedValue(undefined);
        prisma_1.prisma.message.create.mockResolvedValue({ id: 'uuid-123' });
        await (0, uploadMessage_1.uploadMessage)(req, res);
        expect(storage_1.uploadBlobToContainer).toHaveBeenCalledWith((0, storage_1.audioClient)(), '/tmp/audio123.mp3', 'the-glory-of-god.mp3');
        expect(storage_1.uploadBlobToContainer).toHaveBeenCalledWith((0, storage_1.pdfClient)(), '/tmp/doc123.pdf', 'the-glory-of-god.pdf');
        expect(prisma_1.prisma.message.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                title: 'The Glory of God',
                audioFile: 'the-glory-of-god.mp3',
                pdfFile: 'the-glory-of-god.pdf'
            })
        }));
        expect(res.status).toHaveBeenCalledWith(201);
    });
});
