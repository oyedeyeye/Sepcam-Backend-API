import { Request, Response } from 'express';
import { updateMessage } from '../../src/controllers/admin/updateMessage';
import { prisma } from '../../src/lib/prisma';
import * as storage from '../../src/services/storage';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    message: {
      findUnique: jest.fn(),
      update: jest.fn()
    }
  }
}));

jest.mock('../../src/services/storage', () => ({
  deleteBlobFromContainer: jest.fn(),
  uploadBlobToContainer: jest.fn(),
  audioClient: jest.fn().mockReturnValue({}),
  pdfClient: jest.fn().mockReturnValue({}),
  imageClient: jest.fn().mockReturnValue({})
}));

describe('Update Message Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if message does not exist', async () => {
    const req = { params: { id: '999' }, body: {} } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.message.findUnique as jest.Mock).mockResolvedValue(null);

    await updateMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Message not found for update' });
  });

  it('should update string details without patching files', async () => {
    const req = { params: { id: '123' }, body: { title: 'Updated Title' } } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.message.findUnique as jest.Mock).mockResolvedValue({ id: '123' });
    (prisma.message.update as jest.Mock).mockResolvedValue({ id: '123', title: 'Updated Title' });

    await updateMessage(req, res);

    expect(prisma.message.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: { title: 'Updated Title' }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Updated successfully', data: { id: '123', title: 'Updated Title' } });
  });

  it('should upload new blob and delete old blob if req.files is provided', async () => {
    const req = {
      params: { id: '123' },
      body: { title: 'Patched File' },
      files: {
        messageThumbnail: [{ buffer: Buffer.from('data'), originalname: 'new.jpg', mimetype: 'image/jpeg' }]
      }
    } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

    (prisma.message.findUnique as jest.Mock).mockResolvedValue({ id: '123', messageThumbnail: 'old.jpg' });
    (storage.uploadBlobToContainer as jest.Mock).mockResolvedValue('http://azure.com/new.jpg');
    (prisma.message.update as jest.Mock).mockResolvedValue({ id: '123', messageThumbnail: 'http://azure.com/new.jpg' });

    await updateMessage(req, res);

    expect(storage.uploadBlobToContainer).toHaveBeenCalled();
    expect(storage.deleteBlobFromContainer).toHaveBeenCalledWith(storage.imageClient(), 'old.jpg');
    expect(prisma.message.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: expect.objectContaining({ title: 'Patched File', messageThumbnail: expect.any(String) })
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
