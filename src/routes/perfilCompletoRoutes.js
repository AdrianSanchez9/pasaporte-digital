const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');
const { validateSchema } = require('../middleware/validateSchema');
const {
  actualizarCuidadoPersonalSchema,
  actualizarPerfilComunicacionSchema,
  actualizarEmocionesSchema,
  crearGustoSchema,
  actualizarGustoSchema,
} = require('../schemas/perfilCompletoSchemas');
const {
  obtenerCuidadoPersonal,
  actualizarCuidadoPersonal,
  obtenerPerfilComunicacion,
  actualizarPerfilComunicacion,
  obtenerEmociones,
  actualizarEmociones,
  listarGustos,
  crearGusto,
  actualizarGusto,
  eliminarGusto,
} = require('../controllers/perfilCompletoController');


router.get(
  '/:id/cuidado-personal',
  auth,
  requireRole('MEDICO', 'ENFERMERO', 'PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  obtenerCuidadoPersonal
);

router.put(
  '/:id/cuidado-personal',
  auth,
  requireRole('PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  validateSchema(actualizarCuidadoPersonalSchema),
  actualizarCuidadoPersonal
);


router.get(
  '/:id/perfil-comunicacion',
  auth,
  requireRole('MEDICO', 'ENFERMERO', 'PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  obtenerPerfilComunicacion
);

router.put(
  '/:id/perfil-comunicacion',
  auth,
  requireRole('PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  validateSchema(actualizarPerfilComunicacionSchema),
  actualizarPerfilComunicacion
);


router.get(
  '/:id/emociones',
  auth,
  requireRole('MEDICO', 'ENFERMERO', 'PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  obtenerEmociones
);

router.put(
  '/:id/emociones',
  auth,
  requireRole('PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  validateSchema(actualizarEmocionesSchema),
  actualizarEmociones
);


router.get(
  '/:id/gustos',
  auth,
  requireRole('MEDICO', 'ENFERMERO', 'PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  listarGustos
);

router.post(
  '/:id/gustos',
  auth,
  requireRole('PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  validateSchema(crearGustoSchema),
  crearGusto
);

router.put(
  '/:id/gustos/:gustoId',
  auth,
  requireRole('PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  validateSchema(actualizarGustoSchema),
  actualizarGusto
);

router.delete(
  '/:id/gustos/:gustoId',
  auth,
  requireRole('PACIENTE', 'ACOMPAÑANTE', 'ADMIN'),
  eliminarGusto
);

module.exports = router;
