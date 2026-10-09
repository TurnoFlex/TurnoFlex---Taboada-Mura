const { Router } = require("express");
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus
} = require("../controllers/appointments.controller");
const { authenticateToken, requireRole } = require("../middlewares/auth.middleware");

const router = Router();

// Rutas accesibles para clientes y admin autenticados
router.post("/", authenticateToken, createAppointment);
router.get("/my-appointments", authenticateToken, getMyAppointments);
router.patch("/:id/status", authenticateToken, updateAppointmentStatus);

// Ruta exclusiva de administración (agenda global)
router.get("/", authenticateToken, requireRole("ADMIN"), getAllAppointments);

module.exports = router;
