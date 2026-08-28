# PROYECTO.md - TurnoFlex

**Proyecto:** TurnoFlex - Sistema de Gestión de Turnos y Citas  
**Integrantes:** Emir [Apellido] y Máximo [Apellido]  
**Materia:** Programación 3 - 5to Año Técnico  

---

## 1. Límites del Sistema (Scope)

### ✅ Dentro del Sistema (In-Scope)
- **Autenticación y Autorización:** Registro e inicio de sesión con JWT y roles (`ADMIN` y `CLIENTE`).
- **Gestión de Servicios:** CRUD de servicios ofrecidos (nombre, descripción, duración en minutos, precio).
- **Gestión de Turnos (CRUD Central):**
  - Reserva de turnos por parte de clientes.
  - Cancelación de turnos por parte del cliente o administrador.
  - Cambio de estados de un turno: `PENDIENTE`, `CONFIRMADO`, `CANCELADO`, `COMPLETADO`.
  - Validación de solapamiento de horarios (no permitir dos turnos en el mismo horario para el mismo servicio/profesional).
- **Paridad de Backends:** Ambos servicios (Express y FastAPI) expondrán exactamente los mismos endpoints bajo `/api/v1`, con idéntico contrato JSON y códigos HTTP.
- **Paridad de Frontends:** Ambas aplicaciones (React y Vue) compartirán idéntico diseño visual, navegación (routing), consumo de endpoints y manejo de feedback visual.
- **Dockerización:** Contenedor de PostgreSQL con volumen de datos persistente.

### ❌ Fuera del Sistema (Out-of-Scope)
- Procesamiento de pagos en línea (Mercado Pago, Stripe, etc.).
- Notificaciones externas por SMS, WhatsApp o Email real.
- Aplicación móvil nativa (Android / iOS).
- Multi-sucursal o gestión multi-empresa (SaaS).

---

## 2. Alcances Funcionales

- **RF01 - Autenticación:** Registro de clientes e inicio de sesión seguro devolviendo token JWT.
- **RF02 - Gestión de Servicios (Admin):** Crear, listar, modificar y desactivar servicios.
- **RF03 - Catálogo Público de Servicios:** Listar servicios activos y sus duraciones/precios para cualquier usuario autenticado.
- **RF04 - Reserva de Turnos (Cliente):** Seleccionar fecha, hora y servicio disponible para agendar una cita.
- **RF05 - Panel de Turnos (Admin):** Visualizar agenda filtrada por fecha y cambiar el estado del turno (`CONFIRMADO`, `COMPLETADO`, `CANCELADO`).
- **RF06 - Mis Turnos (Cliente):** Visualizar el historial de turnos propios y permitir la cancelación con al menos X tiempo de anticipación.
- **RF07 - Validación de Disponibilidad:** El sistema impedirá crear turnos en horarios pasados o que colisionen con otro turno ya agendado.

---

## 3. Alcances No Funcionales

- **RNF01 (Seguridad):** Contraseñas hasheadas con algoritmo `bcrypt`. Rutas privadas protegidas por middleware de validación JWT.
- **RNF02 (Persistencia):** Motor PostgreSQL 15+ ejecutado vía `docker-compose` utilizando volúmenes de Docker para evitar pérdida de datos.
- **RNF03 (Contrato de API):** Arquitectura REST estricta. Códigos de respuesta estándar (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`).
- **RNF04 (Experiencia de Usuario):** Interfaces responsivas (Mobile/Desktop), spinners de carga durante llamadas asíncronas y alertas de feedback (toast/notificaciones).
- **RNF05 (Mantenibilidad y Git Flow):** Estricto uso de Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`), ramas por issue y Pull Requests aprobados antes del merge a `main`.

---

## 4. Objetivos Específicos y Medibles (SMART)

1. Configurar el entorno Docker con PostgreSQL y scripts de inicialización en menos de 1 semana.
2. Implementar Backend 1 (Node/Express) con 100% de los endpoints funcionales y testeados con Postman.
3. Implementar Backend 2 (Python/FastAPI) replicando con 100% de paridad las rutas, validaciones y respuestas del Backend 1.
4. Implementar Frontend 1 (React + Vite) con 4 vistas principales (`Login/Register`, `Catálogo/Reserva`, `Mis Turnos`, `Panel Admin`).
5. Implementar Frontend 2 (Vue 3 + Vite) replicando con 100% de paridad las 4 vistas e integración con cualquiera de los dos backends intercambiando únicamente la URL base.
