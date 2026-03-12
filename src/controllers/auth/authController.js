const authService = require('../../services/authService');
const {
  verificarEmailDisponible,
  verificarRolExiste,
  verificarPacienteExiste,
} = require('../../utils/authValidations');


const registroNuevo = async (req, res) => {
  try {
    const { email, nombre, apellido, password, rolNombre, especialidad, pacienteId } = req.body;

    await verificarEmailDisponible(email);
    const rol = await verificarRolExiste(rolNombre);

    if (rolNombre === 'MEDICO') {
      if (!especialidad || especialidad.trim() === '') {
        return res.status(400).json({
          error: 'Validación fallida',
          mensaje: 'La especialidad es obligatoria para médicos'
        });
        }
    }

    if (rolNombre === 'ACOMPANANTE') {
      if (!pacienteId) {
        return res.status(400).json({
          error: 'Validación fallida',
          mensaje: 'Debe seleccionar un paciente para el acompañante'
        });
      }
      await verificarPacienteExiste(pacienteId);
    }

    const hashedPassword = await authService.hashPassword(password);

    const user = await authService.crearUsuarioCompleto({
      email, nombre, apellido, hashedPassword, rolId: rol.id, rolNombre, especialidad, pacienteId
    });

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol.nombre,
      },
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(400).json({ error: 'Error en el registro', mensaje: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.login({
      email,
      password,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Protección CSRF
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.json({
      mensaje: 'Login exitoso',
      user,
      accessToken
    });


  } catch (error) {
    console.error('Error en login:', error);

    res.status(401).json({
      error: 'Error de autenticación',
      mensaje: error.message,
    });
  }
};

// ─── Renovar access token ─────
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'No autenticado',
        mensaje: 'No hay refresh token disponible',
      });
    }

    const { accessToken } = await authService.renovarToken(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.json({
      mensaje: 'Token renovado exitosamente',
    });

  } catch (error) {
    console.error('Error en refresh:', error);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(401).json({
      error: 'Error de renovación',
      mensaje: error.message,
    });
  }
};

// ─── Logout ───────
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({
      mensaje: 'Logout exitoso',
    });

  } catch (error) {
    console.error('Error en logout:', error);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(500).json({
      error: 'Error en logout',
      mensaje: error.message,
    });
  }
};

// ─── Logout de todas las sesiones ─────────────────────────────────────────────
const logoutAll = async (req, res) => {
  try {
    // req.user viene del middleware auth.js
    await authService.logoutTodasLasSesiones(req.user.id);

    // Limpiar cookies de esta sesión
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({
      mensaje: 'Cerraste sesión en todos tus dispositivos',
    });

  } catch (error) {
    console.error('Error en logoutAll:', error);

    res.status(500).json({
      error: 'Error al cerrar sesiones',
      mensaje: error.message,
    });
  }
};


const me = async (req, res) => {
  try {
    res.json({
      user: req.user,
    });
  } catch (error) {
    console.error('Error en me:', error);

    res.status(500).json({
      error: 'Error al obtener información del usuario',
      mensaje: error.message,
    });
  }
};

module.exports = {
  registroNuevo,
  login,
  refresh,
  logout,
  logoutAll,
  me,
};
