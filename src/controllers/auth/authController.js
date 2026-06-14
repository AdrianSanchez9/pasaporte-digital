const { z } = require("zod");
const authService = require("../../services/authService");
const pacienteService = require("../../services/pacienteService");
const emailService = require("../../services/emailService");
const generarContrasena = require("../../utils/generarContrasena");
const {
  verificarEmailDisponible,
  verificarRolExiste,
  verificarPacienteExiste,
} = require("../../utils/authValidations");
const {
  registroSchema,
  loginSchema,
  refreshTokenSchema,
  actualizacionContrasenaUsuarioSchema,
} = require("../../schemas/authSchemas");

const registroNuevo = async (req, res) => {
  try {
    console.log("Datos del body :  ", req.body);
    const datosValidados = registroSchema.parse(req.body);

    const { email, nombre, apellido, password, rolNombre, especialidad } =
      datosValidados;

    await verificarEmailDisponible(email);
    const rol = await verificarRolExiste(rolNombre);

    if (rolNombre === "MEDICO") {
      if (!especialidad || especialidad.trim() === "") {
        throw new Error("La especialidad es obligatoria para médicos.");
      }
    }

    const passwordAleatoria = generarContrasena.generarContrasenaTemporal();

    const hashedPassword = await authService.hashPassword(passwordAleatoria);

    const user = await authService.crearUsuarioCompleto({
      email,
      nombre,
      apellido,
      hashedPassword,
      rolId: rol.id,
      rolNombre,
      especialidad,
    });

    await emailService.enviarCredencialesAlta(user.email, passwordAleatoria);

    return res.redirect("/auth/registro?success=true");
  } catch (error) {
    console.error("Error en registro:", error);

    let mensajeError = "Ocurrió un error al procesar el registro.";

    if (error && error.errors && error.errors[0]) {
      mensajeError = error.errors[0].message;
    } else if (error && error.issues && error.issues[0]) {
      mensajeError = error.issues[0].message;
    } else if (error && error.message) {
      mensajeError = error.message;
    }

    return res.status(400).render("auth/registro", {
      error: mensajeError,
      formData: req.body,
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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // Protección CSRF
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return res.redirect("/");
  } catch (error) {
    console.error("Error en login:", error);

    return res.status(401).render("auth/login", {
      title: "Iniciar Sesión",
      error: error.message || "Credenciales inválidas",
      user: null, // Siempre pasamos user: null para que el header no explote
    });
  }
};

// ─── Renovar access token ─────
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: "No autenticado",
        mensaje: "No hay refresh token disponible",
      });
    }

    const { accessToken } = await authService.renovarToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.json({
      mensaje: "Token renovado exitosamente",
    });
  } catch (error) {
    console.error("Error en refresh:", error);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(401).json({
      error: "Error de renovación",
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

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
      mensaje: "Logout exitoso",
    });
  } catch (error) {
    console.error("Error en logout:", error);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(500).json({
      error: "Error en logout",
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
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
      mensaje: "Cerraste sesión en todos tus dispositivos",
    });
  } catch (error) {
    console.error("Error en logoutAll:", error);

    res.status(500).json({
      error: "Error al cerrar sesiones",
      mensaje: error.message,
    });
  }
};

const recuperarContrasena = async (req, res) => {
  try {
    const { email } = req.body;
    const host = req.headers.host;

    await authService.procesarSolicitudRecuperacion(email, host);

    return res.json({
      mensaje: "Se enviara un correo para reestablecer la contraseña.",
    });
  } catch (error) {
    console.error("Error en solicitarRecuperacion:", error);
    return res.status(500).json({
      mensaje: "Error interno del servidor al procesar la solicitud.",
    });
  }
};

const cambiarContrasenaRestauracion = async (req, res) => {
  try {
    const { token } = req.params;

    const { password, confirmPassword } = req.body;

    const datosValidados = actualizacionContrasenaUsuarioSchema.parse({
      password,
      confirmPassword,
    });

    await authService.ejecutarCambioContrasena(token, datosValidados.password);

    return res.json({
      mensaje: "¡Contraseña actualizada con éxito! Ya podés iniciar sesión.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (error.issues && error.issues.length > 0) {
        const primerError = error.issues[0].message;
        return res.status(400).json({ mensaje: primerError });
      }
    }
    return res.status(400).json({
      mensaje:
        error.message ||
        "Hubo un problema al intentar restablecer la contraseña.",
    });
  }
};

const renderLoginForm = (req, res) => {
  res.render("auth/login", {
    title: "Iniciar Sesión",
    error: null,
    query: req.query,
  });
};

const renderRegistroForm = async (req, res) => {
  const pacientes = await pacienteService.mostrarPacientes({});
  console.log("Pacientes ", pacientes);
  res.render("auth/registro", {
    title: "Registrarse",
    error: null,
    formData: {},
    pacientes,
  });
};

module.exports = {
  registroNuevo,
  login,
  refresh,
  logout,
  logoutAll,
  recuperarContrasena,
  renderLoginForm,
  renderRegistroForm,
  recuperarContrasena,
  cambiarContrasenaRestauracion,
};
