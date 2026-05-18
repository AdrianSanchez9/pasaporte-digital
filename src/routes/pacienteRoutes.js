const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");
const { auth } = require("../middleware/auth");
const { requireRole } = require("../middleware/authorize");
const { validateSchema } = require("../middleware/validateSchema");
const {
  actualizarPerfilPacienteSchema,
  contactoPacienteSchema,
} = require("../schemas/pacienteSchemas");
const {
  eliminarArchivo,
  listarPacientes,
  verPaciente,
  actualizarPerfil,
  listarContactos,
  crearContacto,
  eliminarContacto,
  asignarMedicoCabecera,
  actualizarMiMedicoCabecera,
  crearMiContacto,
  actualizarMiContacto,
  eliminarMiContacto,
  verQRPaciente,
  mostrarEscaner,
  mostrarFormularioArchivo,
  subirArchivo,
  listarArchivosHistorial,
  listarArchivosDePaciente,
} = require("../controllers/paciente/pacienteController");

router.get(
  "/escanear",
  auth,
  requireRole("MEDICO", "ADMIN", "ENFERMERO"),
  mostrarEscaner,
);

router.get("/", auth, requireRole("ADMIN"), listarPacientes);

router.put(
  "/mi-medico-cabecera",
  auth,
  requireRole("PACIENTE"),
  actualizarMiMedicoCabecera,
);

router.put(
  "/mi-contacto",
  auth,
  requireRole("PACIENTE"),
  actualizarMiMedicoCabecera,
);
router.post("/mis-contactos", auth, requireRole("PACIENTE"), crearMiContacto);

router.put(
  "/mis-contactos/:contactoId",
  auth,
  requireRole("PACIENTE"),
  actualizarMiContacto,
);

router.delete(
  "/mis-contactos/:contactoId",
  auth,
  requireRole("PACIENTE"),
  eliminarMiContacto,
);

router.get(
  "/qr-paciente",
  auth,
  requireRole("PACIENTE", "ACOMPAÑANTE"),
  verQRPaciente,
);

router.get(
  "/historial-archivos",
  auth,
  requireRole("PACIENTE", "ACOMPAÑANTE"),
  listarArchivosHistorial,
);

// Ruta para la carga de archivos del paciente
router.get(
  "/archivos",
  auth,
  requireRole("PACIENTE", "ACOMPAÑANTE"),
  mostrarFormularioArchivo,
);

router.post("/archivos", auth, upload.single("archivoPdf"), subirArchivo);

router.post(
  "/archivos/:archivoId/eliminar",
  auth,
  requireRole("PACIENTE"),
  eliminarArchivo,
);

router.get(
  "/:id/historial-archivos",
  auth,
  requireRole("MEDICO", "ADMIN"),
  listarArchivosDePaciente,
);

router.get(
  "/:id",
  auth,
  requireRole("MEDICO", "ENFERMERO", "PACIENTE", "ACOMPAÑANTE", "ADMIN"),
  verPaciente,
);

// Actualizar informacion del paciente
router.put(
  "/:id",
  auth,
  requireRole("PACIENTE", "ACOMPAÑANTE"),
  validateSchema(actualizarPerfilPacienteSchema),
  actualizarPerfil,
);

// Listar todos los contactos de un paciente
router.get(
  "/:id/contactos",
  auth,
  requireRole("MEDICO", "ENFERMERO", "PACIENTE", "ACOMPAÑANTE", "ADMIN"),
  listarContactos,
);

// Crear nuevo contacto del paciente
router.post(
  "/:id/contactos",
  auth,
  requireRole("PACIENTE", "ACOMPAÑANTE", "ADMIN"),
  validateSchema(contactoPacienteSchema),
  crearContacto,
);

// Eliminar a un contacto de un paciente
router.delete(
  "/:id/contactos/:contactoId",
  auth,
  requireRole("PACIENTE", "ACOMPAÑANTE", "ADMIN"),
  eliminarContacto,
);

// Asignar medico de cabecera a un paciente
router.put(
  "/:id/medico-cabecera",
  auth,
  requireRole("ADMIN", "PACIENTE"),
  asignarMedicoCabecera,
);

module.exports = router;
