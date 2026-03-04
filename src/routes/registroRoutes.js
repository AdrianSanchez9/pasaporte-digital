
const express = require('express');
const router = express.Router();
const { mostrarFormulario } = require('../controllers/registroController');

router.get('/formulario', mostrarFormulario);

module.exports = router;
