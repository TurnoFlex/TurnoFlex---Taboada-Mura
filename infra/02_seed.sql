-- Insertar Usuarios (1 Admin y 2 Clientes)
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Administrador Sistema', 'admin@turnoflex.com', '$2b$10$e8N81234567890abcdefuO123456789012345678901234567890', 'ADMIN'),
('Carlos Mendoza', 'carlos.mendoza@cliente.com', '$2b$10$e8N81234567890abcdefuO123456789012345678901234567890', 'CLIENTE'),
('Ana Gómez', 'ana.gomez@cliente.com', '$2b$10$e8N81234567890abcdefuO123456789012345678901234567890', 'CLIENTE');

-- Insertar Servicios Base (3 Servicios)
INSERT INTO services (name, description, price, duration_minutes) VALUES
('Corte de Cabello', 'Corte y estilizado profesional', 15.00, 30),
('Limpieza Facial Profunda', 'Tratamiento con exfoliación e hidratación', 35.50, 60),
('Masaje Terapéutico', 'Sesión de masaje descontracturante', 45.00, 45);

-- Insertar Turnos de prueba iniciales
INSERT INTO appointments (user_id, service_id, appointment_date, status) VALUES
(2, 1, '2026-03-10 10:00:00+00', 'PENDIENTE'),
(3, 2, '2026-03-11 15:30:00+00', 'CONFIRMADO');