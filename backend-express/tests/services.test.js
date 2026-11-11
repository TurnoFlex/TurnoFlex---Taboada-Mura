const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
}));

const pool = require('../src/config/db');
const app = require('../src/app');

describe('4. Servicios Suite (CRUD y RBAC)', () => {
  const secret = process.env.JWT_SECRET || 'turnoflex_super_secret_jwt_key_2026';
  const adminToken = jwt.sign({ id: 1, email: 'admin@turnoflex.com', role: 'ADMIN' }, secret, { expiresIn: '1h' });
  const clientToken = jwt.sign({ id: 2, email: 'client@turnoflex.com', role: 'CLIENTE' }, secret, { expiresIn: '1h' });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/v1/services autenticado lista servicios (200)', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Corte', price: 5000, duration_minutes: 30 }] });
    const res = await request(app).get('/api/v1/services').set('Authorization', `Bearer ${clientToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/v1/services con rol CLIENTE responde 403 Forbidden', async () => {
    const res = await request(app).post('/api/v1/services').set('Authorization', `Bearer ${clientToken}`).send({
      name: 'Corte', duration_minutes: 30, price: 5000
    });
    expect(res.statusCode).toBe(403);
  });

  it('POST /api/v1/services como ADMIN con datos inválidos da 400', async () => {
    const res = await request(app).post('/api/v1/services').set('Authorization', `Bearer ${adminToken}`).send({
      name: ''
    });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/v1/services como ADMIN exitoso responde 201', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Corte', price: 5000, duration_minutes: 30 }] });
    const res = await request(app).post('/api/v1/services').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Corte', duration_minutes: 30, price: 5000
    });
    expect(res.statusCode).toBe(201);
  });

  it('PUT /api/v1/services/:id actualiza correctamente (200)', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Corte Pro', price: 6000, duration_minutes: 40 }] });
    const res = await request(app).put('/api/v1/services/1').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Corte Pro', duration_minutes: 40, price: 6000
    });
    expect(res.statusCode).toBe(200);
  });

  it('DELETE /api/v1/services/:id elimina correctamente (200)', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const res = await request(app).delete('/api/v1/services/1').set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});
