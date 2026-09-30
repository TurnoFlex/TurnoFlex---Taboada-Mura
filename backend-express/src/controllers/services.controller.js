const pool = require("../config/db");

const getAllServices = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services ORDER BY id ASC");
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error en getAllServices:", error);
    return res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

const createService = async (req, res) => {
  try {
    const { name, description, duration_minutes, price } = req.body;

    if (!name || !duration_minutes || price === undefined) {
      return res.status(400).json({
        error: "Los campos name, duration_minutes y price son obligatorios."
      });
    }

    if (isNaN(duration_minutes) || duration_minutes <= 0 || isNaN(price) || price < 0) {
      return res.status(400).json({
        error: "duration_minutes y price deben ser valores numéricos positivos."
      });
    }

    const result = await pool.query(
      "INSERT INTO services (name, description, duration_minutes, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description || "", duration_minutes, price]
    );

    return res.status(201).json({
      message: "Servicio creado exitosamente",
      service: result.rows[0]
    });
  } catch (error) {
    console.error("Error en createService:", error);
    return res.status(500).json({ error: "Error interno al crear el servicio" });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration_minutes, price } = req.body;

    if (!name || !duration_minutes || price === undefined) {
      return res.status(400).json({
        error: "Los campos name, duration_minutes y price son obligatorios."
      });
    }

    const result = await pool.query(
      "UPDATE services SET name = $1, description = $2, duration_minutes = $3, price = $4 WHERE id = $5 RETURNING *",
      [name, description || "", duration_minutes, price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Servicio no encontrado." });
    }

    return res.status(200).json({
      message: "Servicio actualizado exitosamente",
      service: result.rows[0]
    });
  } catch (error) {
    console.error("Error en updateService:", error);
    return res.status(500).json({ error: "Error interno al actualizar el servicio" });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM services WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Servicio no encontrado." });
    }

    return res.status(200).json({ message: "Servicio eliminado exitosamente." });
  } catch (error) {
    console.error("Error en deleteService:", error);
    return res.status(500).json({ error: "Error interno al eliminar el servicio" });
  }
};

module.exports = { getAllServices, createService, updateService, deleteService };
