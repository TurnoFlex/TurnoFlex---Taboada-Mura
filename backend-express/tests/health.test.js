const request = require('supertest');
const app = require('../src/app');

describe('1. Health Check Suite', () => {
  it('GET /health responde 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});
