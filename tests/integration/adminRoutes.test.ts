import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/lib/prisma';

describe('Admin Routes - Protection', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should block unauthorized POST requests to /admin/blog', async () => {
    const res = await request(app).post('/admin/blog').send({});
    expect([401, 403]).toContain(res.status);
  });

  it('should block unauthorized POST requests to /admin/daily-word', async () => {
    const res = await request(app).post('/admin/daily-word').send({});
    expect([401, 403]).toContain(res.status);
  });

  it('should block unauthorized POST requests to /admin/live-stream', async () => {
    const res = await request(app).post('/admin/live-stream').send({});
    expect([401, 403]).toContain(res.status);
  });
});
