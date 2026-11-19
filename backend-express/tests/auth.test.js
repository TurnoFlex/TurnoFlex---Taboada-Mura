const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
}));

const pool = require('../src/config/db');
const app = require('../src/app');

describe('2. Autenticación (Auth Suite)', () => {
  const secret = process.env.JWT_SECRET || 'turnoflex_super_secret_jwt_key_2026';
  const adminToken = jwt.sign({ id: 1, email: 'emirtaboada2000@gmail.com', role: 'ADMIN' }, secret, { expiresIn: '1h' });
  const hashedPassword = bcrypt.hashSync('password123', 10);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/v1/auth/register con datos faltantes da 400', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({ email: 'test@test.com' });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/v1/auth/register con email repetido da 400', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Admin', email: 'repetido@test.com', password: 'password123'
    });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/v1/auth/register exitoso responde 201', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    pool.query.mockResolvedValueOnce({ rows: [{ id: 2, name: 'Nuevo', email: 'nuevo@test.com', role: 'CLIENTE', created_at: new Date() }] });
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Nuevo', email: 'nuevo@test.com', password: 'password123'
    });
    expect(res.statusCode).toBe(201);
  });

  it('POST /api/v1/auth/login responde 200 y entrega token', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: 'emirtaboada2000@gmail.com', name: 'Emir', password: hashedPassword, role: 'ADMIN' }]
    });
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'emirtaboada2000@gmail.com', password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/v1/auth/login usuario no encontrado da 401', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'noexiste@test.com', password: 'password123'
    });
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/v1/auth/login con clave incorrecta da 401', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: 'emirtaboada2000@gmail.com', password: hashedPassword, role: 'ADMIN' }]
    });
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'emirtaboada2000@gmail.com', password: 'wrong'
    });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/v1/auth/me sin token da 401', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/v1/auth/me con token válido da 200', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, name: 'Emir', email: 'emirtaboada2000@gmail.com', role: 'ADMIN' }]
    });
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});
