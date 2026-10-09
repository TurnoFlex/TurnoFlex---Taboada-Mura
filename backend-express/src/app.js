const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const servicesRoutes = require("./routes/services.routes");
const appointmentsRoutes = require("./routes/appointments.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Montaje de rutas API v1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/services", servicesRoutes);
app.use("/api/v1/appointments", appointmentsRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "TurnoFlex Express API" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
});
