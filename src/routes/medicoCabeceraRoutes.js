const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');
const { validateSchema } = require('../middleware/validateSchema');
const {
  crearMedicoCabeceraSchema,
  actualizarMedicoCabeceraSchema,
} = require('../schemas/medicoCabeceraSchemas');
const {
  listarMedicosCabecera,
  verMedicoCabecera,
  crearMedicoCabecera,
  actualizarMedicoCabecera,
  eliminarMedicoCabecera,
} = require('../controllers/medicoCabeceraController');


router.get( '/', auth, listarMedicosCabecera );

router.get( '/:id', auth, verMedicoCabecera );

router.post( '/', auth, requireRole('ADMIN','PACIENTE'), validateSchema(crearMedicoCabeceraSchema),
  crearMedicoCabecera
);

router.put( '/:id', auth, requireRole('ADMIN'), validateSchema(actualizarMedicoCabeceraSchema),
  actualizarMedicoCabecera
);

router.delete('/:id',auth,requireRole('ADMIN'),
  eliminarMedicoCabecera
);

module.exports = router;
