const historialService = require('../services/historialPaciente');

const obtenerHistorial = async (req, res) => {
  try {
    const { id } = req.params;

    const historial = await historialService.obtenerHistorial(id);

    res.json({ historial });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      error: 'Error al obtener historial',
      mensaje: error.message,
    });
  }
};

const actualizarHistorial = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const historial = await historialService.actualizarHistorial(id, datos);

    res.json({
      mensaje: 'Historial actualizado exitosamente',
      historial,
    });
  } catch (error) {
    console.error('Error al actualizar historial:', error);
    res.status(500).json({
      error: 'Error al actualizar historial',
      mensaje: error.message,
    });
  }
};

const agregarMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const informacion = await historialService.agregarMedicamento(id, datos);

    res.status(201).json({
      mensaje: 'Medicamento agregado al historial exitosamente',
      medicamento: informacion,
    });
  } catch (error) {
    console.error('Error al agregar medicamento:', error);
    const statusCode = error.message === 'Este medicamento ya está en el historial del paciente' ? 400 : 500;

    res.status(statusCode).json({
      error: 'Error al agregar medicamento',
      mensaje: error.message,
    });
  }
};

const actualizarMedicamento = async (req, res) => {
  try {
    const { medicamentoId } = req.params;
    const datos = req.body;

    const informacion = await historialService.actualizarMedicamento(medicamentoId, datos);

    res.json({
      mensaje: 'Información del medicamento actualizada exitosamente',
      medicamento: informacion,
    });
  } catch (error) {
    console.error('Error al actualizar medicamento:', error);
    res.status(500).json({
      error: 'Error al actualizar medicamento',
      mensaje: error.message,
    });
  }
};

const eliminarMedicamento = async (req, res) => {
  try {
    const { id, medicamentoId } = req.params;

    await historialService.eliminarMedicamento(medicamentoId, id);

    res.json({
      mensaje: 'Medicamento eliminado del historial exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar medicamento:', error);
    const statusCode = error.message === 'Medicamento no encontrado en el historial del paciente' ? 404 : 500;

    res.status(statusCode).json({
      error: 'Error al eliminar medicamento',
      mensaje: error.message,
    });
  }
};

module.exports = {
  obtenerHistorial,
  actualizarHistorial,
  agregarMedicamento,
  actualizarMedicamento,
  eliminarMedicamento,
};
