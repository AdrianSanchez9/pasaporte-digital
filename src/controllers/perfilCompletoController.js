const perfilCompletoService = require('../services/perfilCompletoService');


const obtenerCuidadoPersonal = async (req, res) => {
  try {
    const { id } = req.params;
    const cuidado = await perfilCompletoService.obtenerCuidadoPersonal(id);
    res.json({ cuidadoPersonal: cuidado });
  } catch (error) {
    console.error('Error al obtener cuidado personal:', error);
    res.status(500).json({
      error: 'Error al obtener cuidado personal',
      mensaje: error.message,
    });
  }
};

const actualizarCuidadoPersonal = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const cuidado = await perfilCompletoService.actualizarCuidadoPersonal(id, datos);

    res.json({
      mensaje: 'Cuidado personal actualizado exitosamente',
      cuidadoPersonal: cuidado,
    });
  } catch (error) {
    console.error('Error al actualizar cuidado personal:', error);
    res.status(500).json({
      error: 'Error al actualizar cuidado personal',
      mensaje: error.message,
    });
  }
};

const obtenerPerfilComunicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const perfil = await perfilCompletoService.obtenerPerfilComunicacion(id);
    res.json({ perfilComunicacion: perfil });
  } catch (error) {
    console.error('Error al obtener perfil de comunicación:', error);
    res.status(500).json({
      error: 'Error al obtener perfil de comunicación',
      mensaje: error.message,
    });
  }
};

const actualizarPerfilComunicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const perfil = await perfilCompletoService.actualizarPerfilComunicacion(id, datos);

    res.json({
      mensaje: 'Perfil de comunicación actualizado exitosamente',
      perfilComunicacion: perfil,
    });
  } catch (error) {
    console.error('Error al actualizar perfil de comunicación:', error);
    res.status(500).json({
      error: 'Error al actualizar perfil de comunicación',
      mensaje: error.message,
    });
  }
};

const obtenerEmociones = async (req, res) => {
  try {
    const { id } = req.params;
    const emociones = await perfilCompletoService.obtenerEmociones(id);
    res.json({ emociones });
  } catch (error) {
    console.error('Error al obtener emociones:', error);
    res.status(500).json({
      error: 'Error al obtener emociones',
      mensaje: error.message,
    });
  }
};

const actualizarEmociones = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const emociones = await perfilCompletoService.actualizarEmociones(id, datos);

    res.json({
      mensaje: 'Emociones actualizadas exitosamente',
      emociones,
    });
  } catch (error) {
    console.error('Error al actualizar emociones:', error);
    res.status(500).json({
      error: 'Error al actualizar emociones',
      mensaje: error.message,
    });
  }
};

const listarGustos = async (req, res) => {
  try {
    const { id } = req.params;
    const gustos = await perfilCompletoService.listarGustos(id);
    res.json({ gustos });
  } catch (error) {
    console.error('Error al listar gustos:', error);
    res.status(500).json({
      error: 'Error al listar gustos',
      mensaje: error.message,
    });
  }
};

const crearGusto = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const gusto = await perfilCompletoService.crearGusto(id, datos);

    res.status(201).json({
      mensaje: 'Gusto agregado exitosamente',
      gusto,
    });
  } catch (error) {
    console.error('Error al crear gusto:', error);
    res.status(500).json({
      error: 'Error al crear gusto',
      mensaje: error.message,
    });
  }
};

const actualizarGusto = async (req, res) => {
  try {
    const { id, gustoId } = req.params;
    const datos = req.body;

    const gusto = await perfilCompletoService.actualizarGusto(gustoId, id, datos);

    res.json({
      mensaje: 'Gusto actualizado exitosamente',
      gusto,
    });
  } catch (error) {
    console.error('Error al actualizar gusto:', error);
    const statusCode = error.message === 'Gusto no encontrado' ? 404 : 500;
    res.status(statusCode).json({
      error: 'Error al actualizar gusto',
      mensaje: error.message,
    });
  }
};

const eliminarGusto = async (req, res) => {
  try {
    const { id, gustoId } = req.params;

    await perfilCompletoService.eliminarGusto(gustoId, id);

    res.json({
      mensaje: 'Gusto eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar gusto:', error);
    const statusCode = error.message === 'Gusto no encontrado' ? 404 : 500;
    res.status(statusCode).json({
      error: 'Error al eliminar gusto',
      mensaje: error.message,
    });
  }
};

module.exports = {
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
};
