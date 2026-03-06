
const express = require('express');
const router = express.Router();
const {
  registro,
  registroNuevo,
  login,
  refresh,
  logout,
  logoutAll,
  me,
} = require('../controllers/auth/authController');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');
const { authorizePermission } = require('../middleware/authorize');
const { validateSchema } = require('../middleware/validateSchema');
const {
  registroSchema,
  loginSchema,
  refreshTokenSchema,
} = require('../schemas/authSchemas');

// ─── Rutas públicas (sin autenticación) ───────────────────────────────────────

router.post('/registro', validateSchema(registroSchema), registroNuevo);

router.post('/login', validateSchema(loginSchema), login);

// POST /auth/refresh - Renovar access token (usa cookie automáticamente)
router.post('/refresh', refresh);


// Probando tema de roles y auth
router.get('/me', auth, requireRole('PACIENTE') , me);


module.exports = router;
