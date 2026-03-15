const pacienteService = require('../../services/pacienteService');

const listarPacientes = async (req, res) => {
  try {
    const { search, limit, offset } = req.query;

    const resultado = await pacienteService.listarPacientes({
      search,
      limit: limit ? parseInt(limit) : 10,
      offset: offset ? parseInt(offset) : 0,
    });

    res.json({
      pacientes: resultado.pacientes,
      total: resultado.total,
      limit: limit ? parseInt(limit) : 10,
      offset: offset ? parseInt(offset) : 0,
    });
  } catch (error) {
    console.error('Error al listar pacientes:', error);
    res.status(500).json({
      error: 'Error al listar pacientes',
      mensaje: error.message,
    });
  }
};

const verPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    const paciente = await pacienteService.buscarPacientePorId(id);

    if (!paciente) {
      return res.status(404).json({
        error: 'Paciente no encontrado',
      });
    }

    res.json({ paciente });
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
};
