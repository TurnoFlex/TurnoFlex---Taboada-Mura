const request = require('supertest');
const app = require('../src/app');

describe('TurnoFlex API Test Suite (Cobertura Completa)', () => {
  let adminToken = '';
  let serviceId = null;
  let appointmentId = null;
  const testEmail = `test_${Date.now()}@turnoflex.com`;

  describe('1. Health Check', () => {
    it('GET /health debe responder 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });

  describe('2. Autenticación (Auth)', () => {
    it('POST /api/v1/auth/register debe crear un usuario admin (201)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Admin Test',
          email: testEmail,
          password: 'password123',
          role: 'ADMIN',
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.user).toHaveProperty('id');
    });

    it('POST /api/v1/auth/register con email repetido debe dar 400', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Admin Test',
          email: testEmail,
          password: 'password123',
        });
      expect(res.statusCode).toBe(400);
    });

    it('POST /api/v1/auth/login debe responder 200 y entregar token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testEmail,
          password: 'password123',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      adminToken = res.body.token;
    });

    it('POST /api/v1/auth/login con clave incorrecta debe dar 401', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testEmail,
          password: 'wrong_password',
        });
      expect(res.statusCode).toBe(401);
    });

    it('GET /api/v1/auth/me sin token debe dar 401', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.statusCode).toBe(401);
    });

    it('GET /api/v1/auth/me con token debe dar 200', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.user.email).toBe(testEmail);
    });
  });

  describe('3. Servicios (Services & RBAC)', () => {
    it('POST /api/v1/services como ADMIN debe crear un servicio (201)', async () => {
      const res = await request(app)
        .post('/api/v1/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Corte Test Jest',
          description: 'Prueba automatizada',
          duration_minutes: 30,
          price: 4500,
        });
      expect(res.statusCode).toBe(201);
      serviceId = res.body.service.id;
    });

    it('POST /api/v1/services con datos incompletos debe dar 400', async () => {
      const res = await request(app)
        .post('/api/v1/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: '' });
      expect(res.statusCode).toBe(400);
    });

    it('GET /api/v1/services debe listar servicios (200)', async () => {
      const res = await request(app)
        .get('/api/v1/services')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('PUT /api/v1/services/:id debe actualizar el servicio (200)', async () => {
      const res = await request(app)
        .put(`/api/v1/services/${serviceId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Corte Test Modificado',
          description: 'Nueva descripción',
          duration_minutes: 40,
          price: 5500,
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.service.name).toBe('Corte Test Modificado');
    });

    it('DELETE /api/v1/services/:id debe eliminar un servicio (200)', async () => {
      // Creamos un servicio temporal para borrarlo
      const tempSrv = await request(app)
        .post('/api/v1/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Servicio Borrable', duration_minutes: 20, price: 2000 });
      
      const res = await request(app)
        .delete(`/api/v1/services/${tempSrv.body.service.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('4. Turnos (Appointments & Anti-Solapamiento)', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();

    it('POST /api/v1/appointments con fecha pasada debe dar 400', async () => {
      const res = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          service_id: serviceId,
          start_time: '2020-01-01T10:00:00Z',
        });
      expect(res.statusCode).toBe(400);
    });

    it('POST /api/v1/appointments debe agendar exitosamente (201)', async () => {
      const res = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          service_id: serviceId,
          start_time: futureDate,
        });
      expect(res.statusCode).toBe(201);
      appointmentId = res.body.appointment.id;
    });

    it('POST /api/v1/appointments mismo horario debe responder 409 Conflict', async () => {
      const res = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          service_id: serviceId,
          start_time: futureDate,
        });
      expect(res.statusCode).toBe(409);
    });

    it('GET /api/v1/appointments/my-appointments debe responder 200', async () => {
      const res = await request(app)
        .get('/api/v1/appointments/my-appointments')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/v1/appointments (Admin) debe listar la agenda global (200)', async () => {
      const res = await request(app)
        .get('/api/v1/appointments')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('PATCH /api/v1/appointments/:id/status debe cambiar estado a CANCELADO (200)', async () => {
      const res = await request(app)
        .patch(`/api/v1/appointments/${appointmentId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'CANCELADO' });
      expect(res.statusCode).toBe(200);
      expect(res.body.appointment.status).toBe('CANCELADO');
    });
  });
});
