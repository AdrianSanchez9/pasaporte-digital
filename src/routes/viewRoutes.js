const express = require('express');
const router = express.Router();
const {
  renderHome,
  renderLogin,
  renderRegistro,
} = require('../controllers/viewController');

router.get('/', renderHome);

router.get('/login', renderLogin);

router.get('/registro', renderRegistro);

module.exports = router;
