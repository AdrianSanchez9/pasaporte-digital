const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');
const { validateSchema } = require('../middleware/validateSchema');
const {
  actualizarPerfilPacienteSchema,
  contactoPacienteSchema,
} = require('../schemas/pacienteSchemas');
const {
  listarPacientes,
  verPaciente,
  actualizarPerfil,
  listarContactos,
  crearContacto,
  eliminarContacto,
  asignarMedicoCabecera,
} = require('../controllers/paciente/pacienteController');

// Listar todos los pacientes
router.get('/', auth,
  requireRole('MEDICO', 'ENFERMERO', 'ADMIN'),
  listarPacientes
);

// Ver paciente especifico
router.get( '/:id', auth,
  requireRole('MEDICO', 'ENFERMERO', 'PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  verPaciente
);
// Actualizar informacion del paciente
router.put( '/:id', auth,
  requireRole('PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  validateSchema(actualizarPerfilPacienteSchema),
  actualizarPerfil
);


// Listar todos los contactos de un paciente
router.get( '/:id/contactos', auth,
  requireRole('MEDICO', 'ENFERMERO', 'PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  listarContactos
);

// Crear nuevo contacto del paciente
router.post( '/:id/contactos', auth,
  requireRole('PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  validateSchema(contactoPacienteSchema),
  crearContacto
);

// Eliminar a un contacto de un paciente
router.delete( '/:id/contactos/:contactoId',auth,
  requireRole('PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  eliminarContacto
);

// Asignar medico de cabecera a un paciente
router.put( '/:id/medico-cabecera', auth,
  requireRole('ADMIN', 'PACIENTE'),
  asignarMedicoCabecera
);

module.exports = router;
