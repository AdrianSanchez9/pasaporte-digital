const perfilService = require('../services/perfilService');
const acompananteService = require('../services/acompananteService');


const obtenerMiPerfil = async (req, res) => {
  try {
    // El ID viene del JWT (req.user lo pone el middleware auth)
    const userId = req.user.id;

    const perfil = await perfilService.obtenerPerfilCompleto(userId);

    res.json({ perfil });
  } catch (error) {
    console.error('Error al obtener mi perfil:', error);
    res.status(500).json({
      error: 'Error al obtener perfil',
      mensaje: error.message,
    });
  }
};

const verPerfilCompletoPaciente = async (req, res) => {
  try {
    // El ID viene de la ruta
    const { id } = req.params;

    const perfil = await perfilService.obtenerPerfilCompleto(id);

    // Verificar que es un paciente
    if (!perfil.paciente) {
      return res.status(400).json({
        error: 'Usuario no es un paciente',
        mensaje: 'Solo se puede ver el perfil completo de pacientes',
      });
    }

    res.json({ perfil });
  } catch (error) {
    console.error('Error al ver perfil de paciente:', error);
    const statusCode = error.message === 'Usuario no encontrado' ? 404 : 500;

    res.status(statusCode).json({
      error: 'Error al obtener perfil del paciente',
      mensaje: error.message,
    });
  }
};

const renderPerfil = async (req, res) => {
  try {
    const perfil = await perfilService.obtenerPerfilCompleto(req.user.id);

    res.render('perfil', {
      paciente: perfil.paciente,
      historial: perfil.paciente?.historial,
      cuidadoPersonal: perfil.paciente?.cuidadoPersonal,
      perfilComunicacion: perfil.paciente?.perfilComunicacion,
      emociones: perfil.paciente?.emociones,
    });
  } catch (error) {
    console.error('Error al renderizar perfil:', error);
    res.status(500).render('error', { mensaje: 'Error al cargar el perfil' });
  }
};

const renderPerfilPaciente = async (req, res) => {
  try {
    const obtenerIdPaciente = await acompananteService.obtenerIdPaciente(req.user.id);

    const perfil = await perfilService.obtenerPerfilCompleto(obtenerIdPaciente.pacienteId);

    res.render('perfil', {
      paciente: perfil.paciente,
      historial: perfil.paciente?.historial,
      cuidadoPersonal: perfil.paciente?.cuidadoPersonal,
      perfilComunicacion: perfil.paciente?.perfilComunicacion,
      emociones: perfil.paciente?.emociones,
    });
  } catch (error) {
    console.error('Error al renderizar perfil:', error);
    res.status(500).render('error', { mensaje: 'Error al cargar el perfil' });
  }
};


module.exports = {
  obtenerMiPerfil,
  verPerfilCompletoPaciente,
  renderPerfil,
  renderPerfilPaciente
};
