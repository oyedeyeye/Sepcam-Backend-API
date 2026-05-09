import { Request, Response } from 'express';
import { deleteMessage } from '../../src/controllers/admin/deleteMessage';
import { prisma } from '../../src/lib/prisma';
import * as storage from '../../src/services/storage';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    message: {
      findUnique: jest.fn(),
      delete: jest.fn()
    }
  }
}));

jest.mock('../../src/services/storage', () => ({
  deleteBlobFromContainer: jest.fn(),
  audioClient: jest.fn().mockReturnValue({}),
  pdfClient: jest.fn().mockReturnValue({}),
  imageClient: jest.fn().mockReturnValue({})
}));

describe('Delete Message Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if message does not exist', async () => {
    const req = { params: { id: '999' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.message.findUnique as jest.Mock).mockResolvedValue(null);

    await deleteMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Message not found for deletion' });
    expect(prisma.message.delete).not.toHaveBeenCalled();
  });

  it('should delete a message and its associated blobs by ID', async () => {
    const req = { params: { id: '123' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

    (prisma.message.findUnique as jest.Mock).mockResolvedValue({
      id: '123',
      messageThumbnail: 'thumb.jpg',
      audioFile: 'audio.mp3',
      pdfFile: 'doc.pdf'
    });

    (prisma.message.delete as jest.Mock).mockResolvedValue({ id: '123' });

    await deleteMessage(req, res);

    expect(storage.deleteBlobFromContainer).toHaveBeenCalledTimes(3);
    expect(storage.deleteBlobFromContainer).toHaveBeenCalledWith(storage.imageClient(), 'thumb.jpg');
    expect(storage.deleteBlobFromContainer).toHaveBeenCalledWith(storage.audioClient(), 'audio.mp3');
    expect(storage.deleteBlobFromContainer).toHaveBeenCalledWith(storage.pdfClient(), 'doc.pdf');

    expect(prisma.message.delete).toHaveBeenCalledWith({
      where: { id: '123' }
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
