
const express = require('express');
const router = express.Router();
const {
  registro,
  login,
  refresh,
  logout,
  logoutAll,
  me,
} = require('../controllers/auth/authController');
const { auth } = require('../middleware/auth');
const { validateSchema } = require('../middleware/validateSchema');
const {
  registroSchema,
  loginSchema,
  refreshTokenSchema,
} = require('../schemas/authSchemas');

// ─── Rutas públicas (sin autenticación) ───────────────────────────────────────

// POST /auth/registro - Crear nueva cuenta
router.post('/registro', validateSchema(registroSchema), registro);

// POST /auth/login - Iniciar sesión
router.post('/login', validateSchema(loginSchema), login);

// POST /auth/refresh - Renovar access token (usa cookie automáticamente)
router.post('/refresh', refresh);


module.exports = router;
