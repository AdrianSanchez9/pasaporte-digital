
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
  renderLoginForm,
  renderRegistroForm
} = require('../controllers/auth/authController');
const { auth,isAuthenticated } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');
const { validateSchema } = require('../middleware/validateSchema');
const {
  loginSchema,
  refreshTokenSchema,
} = require('../schemas/authSchemas');

const {
  renderHome,
  renderLogin,
  renderRegistro,
} = require('../controllers/viewController');


router.get('/registro', auth ,requireRole('ADMIN'), renderRegistro);

router.post('/registro', auth , requireRole('ADMIN'),registroNuevo);

router.get('/login', isAuthenticated,  renderLogin);

router.post('/login', isAuthenticated,  validateSchema(loginSchema), login);

router.post('/refresh', refresh);

router.post('/logout', auth ,logout);

router.get('/me', auth, requireRole('PACIENTE') , me);


module.exports = router;
