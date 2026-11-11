const request = require('supertest');
const app = require('../src/app');

describe('3. Middleware de Seguridad Suite', () => {
  it('GET /api/v1/auth/me sin token responde 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/v1/auth/me con token inválido responde 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', 'Bearer token_invalido');
    expect(res.statusCode).toBe(401);
  });
});
