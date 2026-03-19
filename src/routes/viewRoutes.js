const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  renderHome,
} = require('../controllers/viewController');
const {renderPerfil } = require('../controllers/perfilController');
const { requireRole } = require('../middleware/authorize');

router.get('/', auth, renderHome);

router.get('/perfil', auth, requireRole('PACIENTE' , 'ACOMPAÑANTE'), renderPerfil);


module.exports = router;
