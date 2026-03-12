const perfilService = require('../services/perfilService');

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

module.exports = {
  obtenerMiPerfil,
  verPerfilCompletoPaciente,
};
