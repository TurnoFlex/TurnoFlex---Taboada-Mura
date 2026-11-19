const pool = require("../config/db");

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

    const serviceQuery = await pool.query("SELECT * FROM services WHERE id = $1", [service_id]);
    if (serviceQuery.rows.length === 0) {
      return res.status(404).json({ error: "El servicio seleccionado no existe." });
    }

    const service = serviceQuery.rows[0];
    const durationMs = service.duration_minutes * 60 * 1000;
    const requestedEnd = new Date(requestedStart.getTime() + durationMs);

    // Algoritmo Anti-Solapamiento Global:
    // Si ya existe CUALQUIER turno en ese intervalo horario (status != CANCELADO), se bloquea.
    const overlapQuery = `
      SELECT a.id, s.name as service_name, a.start_time, a.end_time
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.status != 'CANCELADO'
        AND a.start_time < $1 
        AND a.end_time > $2
    `;

    const overlapResult = await pool.query(overlapQuery, [
      requestedEnd.toISOString(),
      requestedStart.toISOString()
    ]);

    if (overlapResult.rows.length > 0) {
      const busy = overlapResult.rows[0];
      return res.status(409).json({
        error: `Conflicto de horario: Ya existe un turno reservado (${busy.service_name}) en ese intervalo de horario.`
      });
    }

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
    return res.status(500).json({ error: "Error interno al reservar el turno" });
  }
};

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
    return res.status(500).json({ error: "Error al obtener tus turnos" });
  }
};

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
    return res.status(500).json({ error: "Error al obtener la agenda de turnos" });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const validStatuses = ["PENDIENTE", "CONFIRMADO", "CANCELADO", "COMPLETADO"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Estado inválido." });
    }

    const appointmentQuery = await pool.query("SELECT * FROM appointments WHERE id = $1", [id]);
    if (appointmentQuery.rows.length === 0) return res.status(404).json({ error: "Turno no encontrado." });

    const appointment = appointmentQuery.rows[0];

    if (user.role === "CLIENTE" && appointment.user_id !== user.id) {
      return res.status(403).json({ error: "Acceso denegado." });
    }

    const updateResult = await pool.query(
      "UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    return res.status(200).json({
      message: "Estado actualizado",
      appointment: updateResult.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno al actualizar estado" });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus
};