-- Inserción de Usuarios de prueba
INSERT INTO users (name, email, password, role) VALUES
('Super Admin', 'admin@turnoflex.com', '$2a$10$hashedpassword_admin1', 'ADMIN'),
('Admin Secundario', 'admin2@turnoflex.com', '$2a$10$hashedpassword_admin2', 'ADMIN'),
('Carlos Pérez', 'carlos@mail.com', '$2a$10$hashedpassword_user1', 'CLIENTE'),
('María Gómez', 'maria@mail.com', '$2a$10$hashedpassword_user2', 'CLIENTE'),
('Juan Rodríguez', 'juan@mail.com', '$2a$10$hashedpassword_user3', 'CLIENTE');

-- Inserción de Servicios de prueba
INSERT INTO services (name, description, price, duration_minutes) VALUES
('Consulta Técnica', 'Sesión individual de diagnóstico', 2500.00, 30),
('Corte y Peinado', 'Servicio completo de peluquería', 4500.00, 45),
('Mantenimiento Preventivo', 'Revisión técnica de equipos', 8000.00, 60),
('Asesoría Especializada', 'Atención personalizada para proyectos', 12000.00, 90);

-- Inserción de Turnos de prueba
INSERT INTO appointments (user_id, service_id, appointment_date, status) VALUES
(3, 1, '2026-10-15 10:00:00+00', 'PENDIENTE'),
(3, 2, '2026-10-16 11:30:00+00', 'CONFIRMADO'),
(4, 3, '2026-10-17 15:00:00+00', 'COMPLETADO'),
(5, 1, '2026-10-18 09:00:00+00', 'CANCELADO'),
(4, 4, '2026-10-19 14:00:00+00', 'CONFIRMADO');