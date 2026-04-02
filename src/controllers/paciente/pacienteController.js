const pacienteService = require('../../services/pacienteService');
const perfilService = require('../../services/perfilService');
const qrcode = require('qrcode');
const { eliminarArchivoBd } = require('../../services/historialPaciente');

const listarPacientes = async (req, res) => {
  const { search, page = 1 } = req.query;
  const porPagina = 5;
  const offset = (page - 1) * porPagina;

  const resultado = await pacienteService.listarPacientes({
    search,
    limit: porPagina,
    offset,
  });

  res.render('pacientes/listado-pacientes', {
    pacientes: resultado.pacientes,
    total: resultado.total,
    totalPaginas: Math.ceil(resultado.total / porPagina),
    paginaActual: parseInt(page),
    porPagina,
    searchQuery: search || '',
  });
};

const verPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await perfilService.obtenerPerfilCompleto(id);

    if (!data) {
      return res.status(404).json({
        error: 'Paciente no encontrado',
      });
    }

    res.render('pacientes/vistaPasaporte', {
          usuarioPaciente: data.usuario,
          paciente: data.paciente,
          historial: data.paciente.historial,
          cuidadoPersonal: data.paciente.cuidadoPersonal,
          perfilComunicacion: data.paciente.perfilComunicacion,
          emociones: data.paciente.emociones
        });
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    res.status(500).json({
      error: 'Error al obtener paciente',
      mensaje: error.message,
    });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const pacienteExiste = await pacienteService.buscarPacientePorId(id);
    if (!pacienteExiste) {
      return res.status(404).json({
        error: 'Paciente no encontrado',
      });
    }

    if (datos.fechaNacimiento) {
      datos.fechaNacimiento = new Date(datos.fechaNacimiento);
    }

    const pacienteActualizado = await pacienteService.actualizarPerfil(id, datos);

    res.json({
      mensaje: 'Perfil actualizado exitosamente',
      paciente: pacienteActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({
      error: 'Error al actualizar paciente',
      mensaje: error.message,
    });
  }
};

const listarContactos = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el paciente existe
    const paciente = await pacienteService.buscarPacientePorId(id);
    if (!paciente) {
      return res.status(404).json({
        error: 'Paciente no encontrado',
      });
    }

    const contactos = await pacienteService.listarContactos(id);

    res.json({ contactos });
  } catch (error) {
    console.error('Error al listar contactos:', error);
    res.status(500).json({
      error: 'Error al listar contactos',
      mensaje: error.message,
    });
  }
};

// ─── Crear contacto del paciente ──────────────────────────────────────────────
const crearContacto = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const paciente = await pacienteService.buscarPacientePorId(id);
    if (!paciente) {
      return res.status(404).json({
        error: 'Paciente no encontrado',
      });
    }

    const contacto = await pacienteService.crearContacto(id, datos);

    res.status(201).json({
      mensaje: 'Contacto creado exitosamente',
      contacto,
    });
  } catch (error) {
    console.error('Error al crear contacto:', error);
    res.status(500).json({
      error: 'Error al crear contacto',
      mensaje: error.message,
    });
  }
};

const eliminarContacto = async (req, res) => {
  try {
    const { id, contactoId } = req.params;

    await pacienteService.eliminarContacto(contactoId, id);

    res.json({
      mensaje: 'Contacto eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar contacto:', error);
    res.status(error.message === 'Contacto no encontrado' ? 404 : 500).json({
      error: 'Error al eliminar contacto',
      mensaje: error.message,
    });
  }
};

const asignarMedicoCabecera = async (req, res) => {
  try {
    const { id } = req.params;
    const { medicoCabeceraId } = req.body;

    if (!medicoCabeceraId) {
      return res.status(400).json({
        error: 'Validación fallida',
        mensaje: 'El ID del médico de cabecera es obligatorio',
      });
    }

    const paciente = await pacienteService.asignarMedicoCabecera(id, medicoCabeceraId);

    res.json({
      mensaje: 'Médico de cabecera asignado exitosamente',
      paciente,
    });
  } catch (error) {
    console.error('Error al asignar médico:', error);
    res.status(error.message === 'Médico de cabecera no encontrado' ? 404 : 500).json({
      error: 'Error al asignar médico de cabecera',
      mensaje: error.message,
    });
  }
};

const actualizarMiMedicoCabecera = async (req, res) => {
  try {
    const pacienteId = req.user.id;
    const datos = req.body;

    const paciente = await pacienteService.actualizarMiMedicoCabecera(pacienteId, datos);

    res.json({
      mensaje: 'Médico de cabecera guardado exitosamente',
      medicoCabecera: paciente.medicoCabecera,
    });
  } catch (error) {
    console.error('Error al guardar médico de cabecera:', error);
    res.status(500).json({
      error: 'Error al guardar médico de cabecera',
      mensaje: error.message,
    });
  }
};
const crearMiContacto = async (req, res) => {
  try {
    const pacienteId = req.user.id;
    const contacto = await pacienteService.crearContacto(pacienteId, req.body);
    res.status(201).json({ mensaje: 'Contacto creado exitosamente', contacto });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear contacto', mensaje: error.message });
  }
};

const actualizarMiContacto = async (req, res) => {
  try {
    const pacienteId = req.user.id;
    const { contactoId } = req.params;
    const contacto = await pacienteService.actualizarContacto(contactoId, pacienteId, req.body);
    res.json({ mensaje: 'Contacto actualizado exitosamente', contacto });
  } catch (error) {
    const status = error.message === 'Contacto no encontrado' ? 404 : 500;
    res.status(status).json({ error: 'Error al actualizar contacto', mensaje: error.message });
  }
};

const eliminarMiContacto = async (req, res) => {
  try {
    const pacienteId = req.user.id;
    const { contactoId } = req.params;
    await pacienteService.eliminarContacto(contactoId, pacienteId);
    res.json({ mensaje: 'Contacto eliminado exitosamente' });
  } catch (error) {
    const status = error.message === 'Contacto no encontrado' ? 404 : 500;
    res.status(status).json({ error: 'Error al eliminar contacto', mensaje: error.message });
  }
};

const verQRPaciente = async (req, res) => {
  try {
    const id  = req.user.id;

    console.log ("ID PACIENTE " , id)

    const data = await pacienteService.buscarPacientePorId(id);
        if (!data) {
          return res.status(404).send('Paciente no encontrado');
    }

    console.log ("data" , data)

    const urlPasaporte = `${req.protocol}://${req.get('host')}/pacientes/${id}`;

    const qrImage = await qrcode.toDataURL(urlPasaporte, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });


    res.render('pacientes/qr-paciente', {
      usuarioPaciente: data,
      qrImage: qrImage
    });

  } catch (error) {
    console.error('Error al generar QR:', error);
    res.status(500).send('Error interno al generar el código QR');
  }
};

const mostrarEscaner = (req, res) => {
  res.render('pacientes/escaner');
};

const mostrarFormularioArchivo = (req, res) => {
  res.render('archivos/cargar-archivos', {
    title: 'Carga de archivos',
    error: null,
    user: null,
  });
}


// Pasar la logica de BD a service
const subirArchivo = async (req, res) => {
  try {
    const pacienteId = req.user.id;
    const { nombreOriginal } = req.body;

    if (!req.file) {
      return res.status(400).send('No se detectó ningún archivo.');
    }

    const historial = await prisma.historialPaciente.findUnique({
      where: { pacienteId: pacienteId }
    });

    if (!historial) {
      return res.status(404).send('Error: El paciente no tiene un historial creado.');
    }

    const urlDescarga = req.file.secure_url;
    const uuidGenerado = req.file.public_id;

    await prisma.archivoAdjunto.create({
      data: {
        nombreArchivo: nombreOriginal,
        uuid: uuidGenerado,
        url: urlDescarga,
        historialId: historial.id
      }
    });

    res.redirect(`/`);

  } catch (error) {
    console.error('Error al subir archivo:', error);
    res.status(500).send('Hubo un problema al guardar el archivo.');
  }
};



const listarArchivosHistorial = async (req, res) => {
  try {
    const pacienteId = req.user.id;

    const paciente = await prisma.paciente.findUnique({
      where: { userId: pacienteId },
      include: {
        historial: {
          include: {
            archivosAdjuntos: {
              orderBy: { fechaCarga: 'desc' }
            }
          }
        }
      }
    });

    if (!paciente) {
      return res.status(404).send('Paciente no encontrado');
    }

    console.log ("Paciente datos" , paciente.historial.archivosAdjuntos)

    res.render('pacientes/historial-archivos', {
      paciente,
      title: `Historial de Archivos - ${paciente.nombre}`
    });

  } catch (error) {
    console.error('Error al listar archivos:', error);
    res.status(500).send('Error al cargar el historial de archivos');
  }
};


const eliminarArchivo = async (req, res) => {
  try {
    const archivoId = req.params.archivoId;
    const pacienteId = await eliminarArchivoBd(archivoId);
    res.redirect(`/pacientes/historial-archivos`);

  } catch (error) {
    console.error('Error en el controlador al eliminar archivo:', error);
    res.status(500).send('Hubo un problema al intentar eliminar el archivo permanentemente.');
  }
};


module.exports = {
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
  eliminarArchivo
};
