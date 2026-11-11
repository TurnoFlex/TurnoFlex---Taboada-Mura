const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
}));

const pool = require('../src/config/db');
const app = require('../src/app');

describe('5. Turnos Suite (Anti-Solapamiento y Estados)', () => {
  const secret = process.env.JWT_SECRET || 'turnoflex_super_secret_jwt_key_2026';
  const adminToken = jwt.sign({ id: 1, email: 'admin@turnoflex.com', role: 'ADMIN' }, secret, { expiresIn: '1h' });
  const clientToken = jwt.sign({ id: 2, email: 'client@turnoflex.com', role: 'CLIENTE' }, secret, { expiresIn: '1h' });
  const futureDate = new Date(Date.now() + 86400000).toISOString();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/v1/appointments con fecha pasada responde 400', async () => {
    const res = await request(app).post('/api/v1/appointments').set('Authorization', `Bearer ${clientToken}`).send({
      service_id: 1, start_time: '2020-01-01T10:00:00Z'
    });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/v1/appointments con horario solapado responde 409 Conflict', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, duration_minutes: 30 }] }); // Servicio existe
    pool.query.mockResolvedValueOnce({ rows: [{ id: 99 }] }); // Hay solapamiento
    const res = await request(app).post('/api/v1/appointments').set('Authorization', `Bearer ${clientToken}`).send({
      service_id: 1, start_time: futureDate
    });
    expect(res.statusCode).toBe(409);
  });

  it('POST /api/v1/appointments exitoso responde 201 Created', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, duration_minutes: 30 }] }); // Servicio existe
    pool.query.mockResolvedValueOnce({ rows: [] }); // No hay solapamiento
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, user_id: 2, service_id: 1, status: 'CONFIRMADO' }] });
    const res = await request(app).post('/api/v1/appointments').set('Authorization', `Bearer ${clientToken}`).send({
      service_id: 1, start_time: futureDate
    });
    expect(res.statusCode).toBe(201);
  });

  it('GET /api/v1/appointments/my-appointments responde 200 con turnos propios', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, service_name: 'Corte', status: 'CONFIRMADO' }] });
    const res = await request(app).get('/api/v1/appointments/my-appointments').set('Authorization', `Bearer ${clientToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/v1/appointments (Admin) lista agenda global (200)', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, user_name: 'Juan', status: 'CONFIRMADO' }] });
    const res = await request(app).get('/api/v1/appointments').set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('PATCH /api/v1/appointments/:id/status actualiza estado a CANCELADO (200)', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, user_id: 2, status: 'CONFIRMADO' }] });
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, status: 'CANCELADO' }] });
    const res = await request(app).patch('/api/v1/appointments/1/status').set('Authorization', `Bearer ${clientToken}`).send({
      status: 'CANCELADO'
    });
    expect(res.statusCode).toBe(200);
  });
});
