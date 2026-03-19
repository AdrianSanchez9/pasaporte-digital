const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');
const {
  obtenerMiPerfil,
  verPerfilCompletoPaciente,
  renderPerfilPaciente
} = require('../controllers/perfilController');

router.get(
  '/',
  auth,
  obtenerMiPerfil
);

router.get(
  '/paciente-asociado',
  auth,
  requireRole( 'ACOMPAÑANTE'),
  renderPerfilPaciente
);

router.get(
  '/:id/perfil-paciente/',
  auth,
  requireRole('MEDICO', 'ADMIN' , 'EXTERNO' , 'ENFERMERO'),
  verPerfilCompletoPaciente
);

module.exports = router;
