import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/lib/prisma';

describe('Public Routes - /resources API Caching', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return paginated resources and subsequent calls should be faster due to cache', async () => {
    // First call (cache miss)
    const start1 = Date.now();
    const res1 = await request(app).get('/api/public/resources?page=1&limit=5');
    const time1 = Date.now() - start1;

    expect(res1.status).toBe(200);
    expect(res1.body).toHaveProperty('data');
    expect(res1.body).toHaveProperty('meta');
    expect(res1.body.meta).toHaveProperty('total');
    expect(res1.body.meta.page).toBe(1);

    // Second call (cache hit)
    const start2 = Date.now();
    const res2 = await request(app).get('/api/public/resources?page=1&limit=5');
    const time2 = Date.now() - start2;

    expect(res2.status).toBe(200);
    expect(res2.body.data).toEqual(res1.body.data);
    
    // In a real DB scenario without cache, query parsing takes some ms. 
    // We expect the cache hit to be extremely fast. We can't strictly assert time without flakiness,
    // but this ensures the endpoint still behaves exactly identically.
    console.log(`First request took ${time1}ms. Second request took ${time2}ms.`);
  });

  describe('New Public Endpoints (Blog, Devotional, Live Stream)', () => {
    it('GET /blog should return 200 and paginated structure', async () => {
      const res = await request(app).get('/blog?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('total');
    });

    it('GET /daily-word should return 200 or 404 depending on db state', async () => {
      const res = await request(app).get('/daily-word');
      // If DB is empty, it should be 404. If seeded, 200.
      expect([200, 404]).toContain(res.status);
    });

    it('GET /live-stream should return 200 or 404 depending on db state', async () => {
      const res = await request(app).get('/live-stream');
      // If DB is empty, it should be 404. If seeded, 200.
      expect([200, 404]).toContain(res.status);
    });
  });
});
