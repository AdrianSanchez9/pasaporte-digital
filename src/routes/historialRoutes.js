const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { requireRole } = require("../middleware/authorize");
const { validateSchema } = require("../middleware/validateSchema");
const {
  actualizarHistorialSchema,
  agregarMedicamentoSchema,
  actualizarMedicamentoSchema,
} = require("../schemas/historialSchema");
const {
  obtenerHistorial,
  actualizarHistorial,
  agregarMedicamento,
  actualizarMedicamento,
  eliminarMedicamento,
} = require("../controllers/historialController");

// SACAR ESTA RUTA DESPUES
router.get(
  "/:id",
  auth,
  requireRole("MEDICO", "ENFERMERO", "PACIENTE", "ACOMPAÑANTE", "ADMIN"),
  obtenerHistorial,
);

router.put(
  "/:id",
  auth,
  requireRole("PACIENTE", "ACOMPAÑANTE"),
  validateSchema(actualizarHistorialSchema),
  actualizarHistorial,
);

// Agregar nuevo medicamento al historial del paciente
router.post(
  "/:id/medicamentos",
  auth,
  requireRole("MEDICO", "PACIENTE", "ACOMPAÑANTE", "ADMIN"),
  validateSchema(agregarMedicamentoSchema),
  agregarMedicamento,
);

// Actualizar medicamento del historial del paciente
router.put(
  "/:id/medicamentos/:medicamentoId",
  auth,
  requireRole("MEDICO", "PACIENTE", "ACOMPAÑANTE", "ADMIN"),
  validateSchema(actualizarMedicamentoSchema),
  actualizarMedicamento,
);

router.delete(
  "/:id/medicamentos/:medicamentoId",
  auth,
  requireRole("MEDICO", "PACIENTE", "ACOMPAÑANTE", "ADMIN"),
  eliminarMedicamento,
);

module.exports = router;
