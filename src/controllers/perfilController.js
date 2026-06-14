const perfilService = require("../services/perfilService");
const acompananteService = require("../services/acompananteService");
const authSchemas = require("../schemas/authSchemas");
const bcrypt = require("bcrypt");

const obtenerMiPerfil = async (req, res) => {
  try {
    const userId = req.user.id;

    const perfil = await perfilService.obtenerPerfilCompleto(userId);

    res.json({ perfil });
  } catch (error) {
    console.error("Error al obtener mi perfil:", error);
    res.status(500).json({
      error: "Error al obtener perfil",
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
        error: "Usuario no es un paciente",
        mensaje: "Solo se puede ver el perfil completo de pacientes",
      });
    }

    res.json({ perfil });
  } catch (error) {
    console.error("Error al ver perfil de paciente:", error);
    const statusCode = error.message === "Usuario no encontrado" ? 404 : 500;

    res.status(statusCode).json({
      error: "Error al obtener perfil del paciente",
      mensaje: error.message,
    });
  }
};

const renderPerfil = async (req, res) => {
  try {
    const perfil = await perfilService.obtenerPerfilCompleto(req.user.id);

    res.render("perfil", {
      paciente: perfil.paciente,
      historial: perfil.paciente?.historial,
      cuidadoPersonal: perfil.paciente?.cuidadoPersonal,
      perfilComunicacion: perfil.paciente?.perfilComunicacion,
      emociones: perfil.paciente?.emociones,
    });
  } catch (error) {
    console.error("Error al renderizar perfil:", error);
    res.status(500).render("error", { mensaje: "Error al cargar el perfil" });
  }
};

const renderPerfilPaciente = async (req, res) => {
  try {
    const obtenerIdPaciente = await acompananteService.obtenerIdPaciente(
      req.user.id,
    );

    if (!obtenerIdPaciente || !obtenerIdPaciente.pacienteId) {
      return res.render("perfil", {
        paciente: null,
        historial: null,
        cuidadoPersonal: null,
        perfilComunicacion: null,
        emociones: null,
      });
    }

    const perfil = await perfilService.obtenerPerfilCompleto(
      obtenerIdPaciente.pacienteId,
    );

    res.render("perfil", {
      paciente: perfil.paciente,
      historial: perfil.paciente?.historial,
      cuidadoPersonal: perfil.paciente?.cuidadoPersonal,
      perfilComunicacion: perfil.paciente?.perfilComunicacion,
      emociones: perfil.paciente?.emociones,
    });
  } catch (error) {
    console.error("Error al renderizar perfil:", error);
    res.status(500).render("error", { mensaje: "Error al cargar el perfil" });
  }
};

const actualizarDatos = async (req, res) => {
  try {
    const userId = req.user.id;

    const datosValidados = authSchemas.actualizacionDatosUsuarioSchema.parse(
      req.body,
    );

    await perfilService.actualizarDatosPersonales(
      userId,
      datosValidados.nombre,
      datosValidados.apellido,
    );

    return res.redirect("/perfil/cuenta?success=datos");
  } catch (error) {
    console.error("Error al actualizar datos personales:", error);

    let mensajeError = "Ocurrió un error al actualizar los datos personales.";

    if (error && error.errors && error.errors[0]) {
      mensajeError = error.errors[0].message;
    } else if (error && error.issues && error.issues[0]) {
      mensajeError = error.issues[0].message;
    } else if (error && error.message) {
      mensajeError = error.message;
    }

    return res.status(400).render("usuario/datos-usuario", {
      title: "Datos de usuario",
      error: mensajeError,
      user: req.user,
    });
  }
};

const actualizarContrasena = async (req, res) => {
  try {
    const userId = req.user.id;

    const saltRounds = 10;

    const datos = {
      password: req.body.nuevaPassword,
      confirmPassword: req.body.confirmarPassword,
    };

    const datosValidos =
      authSchemas.actualizacionContrasenaUsuarioSchema.parse(datos);

    const hashedPassword = await bcrypt.hash(datosValidos.password, saltRounds);

    await perfilService.actualizarPassword(userId, hashedPassword);
    return res.redirect("/perfil/cuenta?success=password");
  } catch (error) {
    let mensajeError = "Ocurrió un error al actualizar la contraseña.";
    if (error && error.errors && error.errors[0]) {
      mensajeError = error.errors[0].message;
    } else if (error && error.issues && error.issues[0]) {
      mensajeError = error.issues[0].message;
    } else if (error && error.message) {
      mensajeError = error.message;
    }

    return res.status(400).render("usuario/datos-usuario", {
      title: "Datos de usuario",
      error: mensajeError,
      user: req.user,
    });
  }
};

const datosUsuario = async (req, res) => {
  try {
    const usuarioDB = await perfilService.datosUsuario(req.user.id);
    if (!usuarioDB) return res.redirect("/auth/login");

    usuarioDB.rolNombre = usuarioDB.rol.nombre;

    let nombrePacienteAsociado = null;
    let especialidadMedica = null;

    // Ajustamos los nombres aquí también:
    if (usuarioDB.rolNombre === "ACOMPAÑANTE" && usuarioDB.datosAcompanante) {
      const p = usuarioDB.datosAcompanante.paciente.user;
      nombrePacienteAsociado = `${p.nombre} ${p.apellido}`;
    }

    if (usuarioDB.rolNombre === "MEDICO" && usuarioDB.datosMedico) {
      especialidadMedica = usuarioDB.datosMedico.especialidad;
    }

    res.render("usuario/datos-usuario", {
      title: "Mi Cuenta",
      user: usuarioDB,
      nombrePacienteAsociado,
      especialidadMedica,
      error: null,
      success: req.query.success || null,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error de servidor");
  }
};

module.exports = {
  obtenerMiPerfil,
  verPerfilCompletoPaciente,
  renderPerfil,
  renderPerfilPaciente,
  actualizarDatos,
  actualizarContrasena,
  datosUsuario,
};
