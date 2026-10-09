const pool = require("../config/db");

// Crear / Reservar un Turno con Algoritmo Anti-Solapamiento
const createAppointment = async (req, res) => {
  try {
    const { service_id, start_time } = req.body;
    const user_id = req.user.id;

    if (!service_id || !start_time) {
      return res.status(400).json({ error: "service_id y start_time son obligatorios." });
    }

    const requestedStart = new Date(start_time);
    const now = new Date();

    if (isNaN(requestedStart.getTime())) {
      return res.status(400).json({ error: "Formato de fecha u hora inválido." });
    }

    if (requestedStart < now) {
      return res.status(400).json({ error: "No se pueden agendar turnos en fechas u horas pasadas." });
    }

    // Buscar el servicio para obtener la duración en minutos
    const serviceQuery = await pool.query("SELECT * FROM services WHERE id = $1", [service_id]);
    if (serviceQuery.rows.length === 0) {
      return res.status(404).json({ error: "El servicio seleccionado no existe." });
    }

    const service = serviceQuery.rows[0];
    const durationMs = service.duration_minutes * 60 * 1000;
    const requestedEnd = new Date(requestedStart.getTime() + durationMs);

    // Algoritmo Anti-Solapamiento (Verifica si hay solapamiento para el mismo servicio)
    // (start_time < requestedEnd) AND (end_time > requestedStart) AND status != CANCELADO
    const overlapQuery = `
      SELECT id FROM appointments 
      WHERE service_id = $1 
        AND status != $2
        AND start_time < $3 
        AND end_time > $4
    `;

    const overlapResult = await pool.query(overlapQuery, [
      service_id,
      "CANCELADO",
      requestedEnd.toISOString(),
      requestedStart.toISOString()
    ]);

    if (overlapResult.rows.length > 0) {
      return res.status(409).json({
        error: "Conflicto de horario: El turno seleccionado ya se encuentra ocupado para este servicio."
      });
    }

    // Insertar el turno
    const insertQuery = `
      INSERT INTO appointments (user_id, service_id, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const newAppointment = await pool.query(insertQuery, [
      user_id,
      service_id,
      requestedStart.toISOString(),
      requestedEnd.toISOString(),
      "CONFIRMADO"
    ]);

    return res.status(201).json({
      message: "Turno reservado exitosamente",
      appointment: newAppointment.rows[0]
    });
  } catch (error) {
    console.error("Error en createAppointment:", error);
    return res.status(500).json({ error: "Error interno al reservar el turno" });
  }
};

// Ver mis turnos (Cliente autenticado)
const getMyAppointments = async (req, res) => {
  try {
    const user_id = req.user.id;
    const query = `
      SELECT a.id, a.start_time, a.end_time, a.status, a.created_at,
             s.name AS service_name, s.price, s.duration_minutes
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.user_id = $1
      ORDER BY a.start_time DESC
    `;
    const result = await pool.query(query, [user_id]);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error en getMyAppointments:", error);
    return res.status(500).json({ error: "Error al obtener tus turnos" });
  }
};

// Ver todos los turnos (Admin)
const getAllAppointments = async (req, res) => {
  try {
    const query = `
      SELECT a.id, a.start_time, a.end_time, a.status, a.created_at,
             u.name AS user_name, u.email AS user_email,
             s.name AS service_name, s.price, s.duration_minutes
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN services s ON a.service_id = s.id
      ORDER BY a.start_time DESC
    `;
    const result = await pool.query(query);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error en getAllAppointments:", error);
    return res.status(500).json({ error: "Error al obtener la agenda de turnos" });
  }
};

// Cambiar estado de un turno (Admin o Cliente cancelando el suyo)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const validStatuses = ["PENDIENTE", "CONFIRMADO", "CANCELADO", "COMPLETADO"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Estado inválido. Opciones permitidas: PENDIENTE, CONFIRMADO, CANCELADO, COMPLETADO."
      });
    }

    const appointmentQuery = await pool.query("SELECT * FROM appointments WHERE id = $1", [id]);
    if (appointmentQuery.rows.length === 0) {
      return res.status(404).json({ error: "Turno no encontrado." });
    }

    const appointment = appointmentQuery.rows[0];

    // Si es cliente, solo puede cancelar su propio turno
    if (user.role === "CLIENTE") {
      if (appointment.user_id !== user.id) {
        return res.status(403).json({ error: "Acceso denegado: no podés modificar turnos de otro usuario." });
      }
      if (status !== "CANCELADO") {
        return res.status(403).json({ error: "Los clientes solo pueden cancelar turnos." });
      }
    }

    const updateResult = await pool.query(
      "UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    return res.status(200).json({
      message: "Estado del turno actualizado exitosamente",
      appointment: updateResult.rows[0]
    });
  } catch (error) {
    console.error("Error en updateAppointmentStatus:", error);
    return res.status(500).json({ error: "Error interno al actualizar el estado del turno" });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus
};
