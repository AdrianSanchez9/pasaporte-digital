const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { auth } = require("../middleware/auth");
const { requireRole } = require("../middleware/authorize");
const {
  obtenerMiPerfil,
  verPerfilCompletoPaciente,
  renderPerfilPaciente,
} = require("../controllers/perfilController");

const perfilController = require("../controllers/perfilController");

router.get("/cuenta", auth, perfilController.datosUsuario);

router.get(
  "/paciente-asociado",
  auth,
  requireRole("ACOMPAÑANTE"),
  renderPerfilPaciente,
);

router.get(
  "/:id/perfil-paciente/",
  auth,
  requireRole("MEDICO", "ADMIN", "EXTERNO", "ENFERMERO"),
  verPerfilCompletoPaciente,
);

router.put("/actualizar-datos", auth, perfilController.actualizarDatos);
router.put(
  "/actualizar-contrasena",
  auth,
  perfilController.actualizarContrasena,
);

module.exports = router;
