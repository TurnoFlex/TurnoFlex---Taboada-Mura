const { Router } = require("express");
const {
  getAllServices,
  createService,
  updateService,
  deleteService
} = require("../controllers/services.controller");
const { authenticateToken, requireRole } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/", authenticateToken, getAllServices);
router.post("/", authenticateToken, requireRole("ADMIN"), createService);
router.put("/:id", authenticateToken, requireRole("ADMIN"), updateService);
router.delete("/:id", authenticateToken, requireRole("ADMIN"), deleteService);

module.exports = router;
