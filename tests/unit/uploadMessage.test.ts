import { Request, Response } from 'express';
import { uploadMessage } from '../../src/controllers/admin/uploadMessage';
import { uploadBlobToContainer, pdfClient, audioClient, imageClient } from '../../src/services/storage';
import { prisma } from '../../src/lib/prisma';

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
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (uploadBlobToContainer as jest.Mock).mockResolvedValue(undefined);
    (prisma.message.create as jest.Mock).mockResolvedValue({ id: 'uuid-123' });

    await uploadMessage(req, res);

    expect(uploadBlobToContainer).toHaveBeenCalledWith(
      audioClient(),
      '/tmp/audio123.mp3',
      'the-glory-of-god.mp3'
    );

    expect(uploadBlobToContainer).toHaveBeenCalledWith(
      pdfClient(),
      '/tmp/doc123.pdf',
      'the-glory-of-god.pdf'
    );

    expect(prisma.message.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        title: 'The Glory of God',
        audioFile: 'the-glory-of-god.mp3',
        pdfFile: 'the-glory-of-god.pdf'
      })
    }));

    expect(res.status).toHaveBeenCalledWith(201);
  });
});
