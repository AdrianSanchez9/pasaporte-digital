const medicoCabeceraService = require('../services/medicoCabeceraService');

const listarMedicosCabecera = async (req, res) => {
  try {
    const { search, limit, offset } = req.query;

    const resultado = await medicoCabeceraService.listarMedicosCabecera({
      search,
      limit: limit ? parseInt(limit) : 10,
      offset: offset ? parseInt(offset) : 0,
    });

    res.json({
      medicos: resultado.medicos,
      total: resultado.total,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
    });
  } catch (error) {
    console.error('Error al listar médicos de cabecera:', error);
    res.status(500).json({
      error: 'Error al listar médicos de cabecera',
      mensaje: error.message,
    });
  }
};

const verMedicoCabecera = async (req, res) => {
  try {
    const { id } = req.params;

    const medico = await medicoCabeceraService.buscarMedicoCabeceraPorId(id);

    if (!medico) {
      return res.status(404).json({
        error: 'Médico de cabecera no encontrado',
      });
    }

    res.json({ medico });
  } catch (error) {
    console.error('Error al obtener médico de cabecera:', error);
    res.status(500).json({
      error: 'Error al obtener médico de cabecera',
      mensaje: error.message,
    });
  }
};

const crearMedicoCabecera = async (req, res) => {
  try {
    const datos = req.body;

    const medico = await medicoCabeceraService.crearMedicoCabecera(datos);

    res.status(201).json({
      mensaje: 'Médico de cabecera creado exitosamente',
      medico,
    });
  } catch (error) {
    console.error('Error al crear médico de cabecera:', error);
    res.status(500).json({
      error: 'Error al crear médico de cabecera',
      mensaje: error.message,
    });
  }
};

const actualizarMedicoCabecera = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const medico = await medicoCabeceraService.actualizarMedicoCabecera(id, datos);

    res.json({
      mensaje: 'Médico de cabecera actualizado exitosamente',
      medico,
    });
  } catch (error) {
    console.error('Error al actualizar médico de cabecera:', error);
    res.status(500).json({
      error: 'Error al actualizar médico de cabecera',
      mensaje: error.message,
    });
  }
};

const eliminarMedicoCabecera = async (req, res) => {
  try {
    const { id } = req.params;

    await medicoCabeceraService.eliminarMedicoCabecera(id);

    res.json({
      mensaje: 'Médico de cabecera eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar médico de cabecera:', error);
    const statusCode =
      error.message === 'Médico de cabecera no encontrado' ? 404 :
      error.message.includes('No se puede eliminar') ? 400 : 500;

    res.status(statusCode).json({
      error: 'Error al eliminar médico de cabecera',
      mensaje: error.message,
    });
  }
};

module.exports = {
  listarMedicosCabecera,
  verMedicoCabecera,
  crearMedicoCabecera,
  actualizarMedicoCabecera,
  eliminarMedicoCabecera,
};
