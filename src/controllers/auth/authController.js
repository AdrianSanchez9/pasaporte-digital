const { z } = require('zod');
const authService = require('../../services/authService');
const {
  verificarEmailDisponible,
  verificarRolExiste,
  verificarPacienteExiste,
} = require('../../utils/authValidations');
const {
  registroSchema,
  loginSchema,
  refreshTokenSchema,
} = require('../../schemas/authSchemas');

const registroNuevo = async (req, res) => {
  try {
    const datosValidados = registroSchema.parse(req.body);

    const { email, nombre, apellido, password, rolNombre, especialidad, pacienteId } = datosValidados;

    await verificarEmailDisponible(email);
    const rol = await verificarRolExiste(rolNombre);

    if (rolNombre === 'MEDICO') {
      if (!especialidad || especialidad.trim() === '') {
        throw new Error('La especialidad es obligatoria para médicos.');
      }
    }

    if (rolNombre === 'ACOMPANANTE') {
      if (!pacienteId) {
        throw new Error('Debe seleccionar un paciente para el acompañante.');
      }
      await verificarPacienteExiste(pacienteId);
    }

    const hashedPassword = await authService.hashPassword(password);

    const user = await authService.crearUsuarioCompleto({
      email, nombre, apellido, hashedPassword, rolId: rol.id, rolNombre, especialidad, pacienteId
    });

    return res.redirect('/auth/registro?success=true');

  } catch (error) {
    console.error('Error en registro:', error);

    let mensajeError = 'Ocurrió un error al procesar el registro.';

    if (error && error.errors && error.errors[0]) {
      mensajeError = error.errors[0].message;
    } else if (error && error.issues && error.issues[0]) {
      mensajeError = error.issues[0].message;
    } else if (error && error.message) {
      mensajeError = error.message;
    }

    return res.status(400).render('auth/registro', {
      error: mensajeError,
      formData: req.body
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

    return res.redirect('/');

  } catch (error) {
    console.error('Error en login:', error);

    return res.status(401).render('auth/login', {
            title: 'Iniciar Sesión',
            error: error.message || 'Credenciales inválidas',
            user: null // Siempre pasamos user: null para que el header no explote
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

const renderLoginForm = (req, res) => {
  res.render('auth/login', {
    title: 'Iniciar Sesión',
    error: null,
    query: req.query, // Para mensajes tipo ?registrado=true
  });
};

const renderRegistroForm = (req, res) => {
  res.render('auth/registro', {
    title: 'Registrarse',
    error: null,
    formData: {}, // Datos vacíos al principio
  });
};

module.exports = {
  registroNuevo,
  login,
  refresh,
  logout,
  logoutAll,
  me,
  renderLoginForm,
  renderRegistroForm
};
