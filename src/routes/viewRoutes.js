const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  renderHome,
  renderLogin,
  renderRegistro,
} = require('../controllers/viewController');

router.get('/', auth, renderHome);

router.get('/registro', renderRegistro);

module.exports = router;
