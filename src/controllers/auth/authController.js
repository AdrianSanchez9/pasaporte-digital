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

    if (rolNombre === 'ACOMPANANTE') {
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

const registro = async (req, res) => {
  try {
    const { email,nombre, apellido, password, rolNombre, pacienteId } = req.body;

    // 1. Validaciones de negocio
    await verificarEmailDisponible(email);

    const rol = await verificarRolExiste(rolNombre);

    if (rolNombre === 'ACOMPAÑANTE') {
      await verificarPacienteExiste(pacienteId);
    }

    const hashedPassword = await authService.hashPassword(password);

    const user = await authService.crearUsuario({
      email,
      nombre,
      apellido,
      hashedPassword,
      rolId: rol.id,
    });

    if (rolNombre === 'PACIENTE') {
      await authService.crearPaciente(user.id);
    }

    if (rolNombre === 'MEDICO') {
      await authService.crearMedico(user.id);
    }

    if (rolNombre === 'ACOMPAÑANTE') {
      await authService.crearAcompañante(user.id, pacienteId);
    }

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

    res.status(400).json({
      error: 'Error en el registro',
      mensaje: error.message,
    });
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

    // 3. Responder con información del usuario
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
    // 1. Leer refresh token de las cookies
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'No autenticado',
        mensaje: 'No hay refresh token disponible',
      });
    }

    const { accessToken } = await authService.renovarToken(refreshToken);

    // 3. Actualizar cookie del access token
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

// ─── Obtener información del usuario actual ────────────
const me = async (req, res) => {
  try {
    // req.user viene del middleware auth.js
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
  registro,
  registroNuevo,
  login,
  refresh,
  logout,
  logoutAll,
  me,
};
