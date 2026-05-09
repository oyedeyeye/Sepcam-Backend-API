import { Request, Response } from 'express';
import { prisma } from '../../src/lib/prisma';
import * as storage from '../../src/services/storage';
import { createEvent } from '../../src/controllers/admin/events/createEvent';
import { updateEvent } from '../../src/controllers/admin/events/updateEvent';
import { deleteEvent } from '../../src/controllers/admin/events/deleteEvent';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    event: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

jest.mock('../../src/services/storage', () => ({
  uploadBlobToContainer: jest.fn(),
  deleteBlobFromContainer: jest.fn(),
  imageClient: jest.fn().mockReturnValue({})
}));

describe('Admin Events Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create an event with a thumbnail', async () => {
      const req = {
        body: { title: 'Event', description: 'Desc', date: '2026-10-10' },
        file: { buffer: Buffer.from('data'), originalname: 'thumb.jpg', mimetype: 'image/jpeg' }
      } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (storage.uploadBlobToContainer as jest.Mock).mockResolvedValue('http://azure.com/thumb.jpg');
      (prisma.event.create as jest.Mock).mockResolvedValue({ id: '1', title: 'Event' });

      await createEvent(req, res);

      expect(storage.uploadBlobToContainer).toHaveBeenCalled();
      expect(prisma.event.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Event',
          thumbnail: expect.any(String)
        })
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateEvent', () => {
    it('should update event and replace thumbnail', async () => {
      const req = {
        params: { id: '1' },
        body: { title: 'New Title' },
        file: { buffer: Buffer.from('data'), originalname: 'new.jpg', mimetype: 'image/jpeg' }
      } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (prisma.event.findUnique as jest.Mock).mockResolvedValue({ id: '1', thumbnail: 'old.jpg' });
      (storage.uploadBlobToContainer as jest.Mock).mockResolvedValue('http://azure.com/new.jpg');
      (prisma.event.update as jest.Mock).mockResolvedValue({ id: '1', title: 'New Title' });

      await updateEvent(req, res);

      expect(storage.deleteBlobFromContainer).toHaveBeenCalledWith(storage.imageClient(), 'old.jpg');
      expect(storage.uploadBlobToContainer).toHaveBeenCalled();
      expect(prisma.event.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({ title: 'New Title', thumbnail: expect.any(String) })
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteEvent', () => {
    it('should delete event and its associated thumbnail blob', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as unknown as Response;

      (prisma.event.findUnique as jest.Mock).mockResolvedValue({ id: '1', thumbnail: 'thumb.jpg' });
      
      await deleteEvent(req, res);

      expect(storage.deleteBlobFromContainer).toHaveBeenCalledWith(storage.imageClient(), 'thumb.jpg');
      expect(prisma.event.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
