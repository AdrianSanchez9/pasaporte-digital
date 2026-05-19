const bcrypt = require("bcryptjs");
const prisma = require("../config/database");
const emailService = require("./emailService");
const crypto = require("crypto");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getExpirationDate,
  JWT_REFRESH_EXPIRES_IN,
} = require("../config/jwt");

const hashPassword = async (password) => {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
  return await bcrypt.hash(password, rounds);
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const crearUsuarioCompleto = async (data) => {
  const {
    email,
    nombre,
    apellido,
    hashedPassword,
    rolId,
    rolNombre,
    especialidad,
    pacienteId,
  } = data;

  let datosPerfil = {};

  if (rolNombre === "PACIENTE") {
    datosPerfil = { datosPaciente: { create: {} } };
  } else if (rolNombre === "MEDICO") {
    datosPerfil = { datosMedico: { create: { especialidad } } };
  } else if (rolNombre === "ACOMPANANTE") {
    datosPerfil = { datosAcompanante: { create: { pacienteId } } };
  }

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nombre,
      apellido,
      rolId,
      ...datosPerfil,
    },
    include: {
      rol: true,
    },
  });
};

const crearUsuario = async ({ email, hashedPassword, rolId }) => {
  const user = await prisma.user.create({
    data: {
      email,
      nombre,
      apellido,
      password: hashedPassword,
      rolId,
    },
    include: {
      rol: true,
    },
  });

  return user;
};

const crearPaciente = async (userId) => {
  return await prisma.paciente.create({
    data: {
      userId,
      nombre: "", // Se completa después en el perfil
      apellido: "",
      dni: "",
    },
  });
};

// ─── Crear registro de médico (datos vacíos iniciales) ───────────────────────
const crearMedico = async (userId) => {
  return await prisma.medico.create({
    data: {
      userId,
      nombre: "",
      apellido: "",
      matricula: "",
    },
  });
};

// ─── Crear registro de acompañante ────────────────────────────────────────────
const crearAcompañante = async (userId, pacienteId) => {
  return await prisma.acompañante.create({
    data: {
      userId,
      nombre: "",
      apellido: "",
      pacienteId,
    },
  });
};

// ─── Login: verificar credenciales ────────────────────────────────────────────
const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      rol: {
        include: {
          permisos: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  if (!user.activo) {
    throw new Error("Usuario deshabilitado. Contactá al administrador.");
  }

  const passwordValida = await verifyPassword(password, user.password);

  if (!passwordValida) {
    throw new Error("Credenciales inválidas");
  }

  const payload = {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    rolNombre: user.rol.nombre,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getExpirationDate(JWT_REFRESH_EXPIRES_IN),
    },
  });

  // 6. Mapear permisos
  const permisos = user.rol.permisos.map((rp) => rp.permission.accion);

  return {
    user: {
      id: user.id,
      email: user.email,
      rol: user.rol.nombre,
      permisos,
    },
    accessToken,
    refreshToken,
  };
};

const renovarToken = async (refreshToken) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error("Refresh token inválido o expirado");
  }

  const tokenEnDB = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: {
      user: {
        include: {
          rol: true,
        },
      },
    },
  });

  if (!tokenEnDB) {
    throw new Error("Refresh token no encontrado");
  }

  if (tokenEnDB.revoked) {
    throw new Error("Refresh token revocado");
  }

  if (new Date() > tokenEnDB.expiresAt) {
    throw new Error("Refresh token expirado");
  }

  const nuevoPayload = {
    id: tokenEnDB.user.id,
    email: tokenEnDB.user.email,
    rolId: tokenEnDB.user.rolId,
    rolNombre: tokenEnDB.user.rol.nombre,
  };

  const nuevoAccessToken = generateAccessToken(nuevoPayload);

  return {
    accessToken: nuevoAccessToken,
  };
};

const logout = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  await prisma.refreshToken.updateMany({
    where: { token: refreshToken },
    data: { revoked: true },
  });
};

const logoutTodasLasSesiones = async (userId) => {
  await prisma.refreshToken.updateMany({
    where: {
      userId: userId,
      revoked: false,
    },
    data: { revoked: true },
  });
};

const procesarSolicitudRecuperacion = async (email, host) => {
  const usuario = await prisma.user.findUnique({ where: { email } });

  if (!usuario) return true;

  const token = crypto.randomBytes(32).toString("hex");
  const expiracion = new Date(Date.now() + 3600000);

  await prisma.user.update({
    where: { email },
    data: { resetPasswordToken: token, resetPasswordExpires: expiracion },
  });

  const resetUrl = `http://${host}/auth/restaurar-contrasena/${token}`;

  await emailService.enviarRecuperarContrasena(usuario.email, resetUrl);

  return true;
};

const ejecutarCambioContrasena = async (token, nuevaPassword) => {
  const usuario = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() },
    },
  });

  console.log("-----------------");
  console.log(usuario);

  if (!usuario) {
    throw new Error("El enlace de recuperación es inválido o ha expirado.");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHasheada = await bcrypt.hash(nuevaPassword, salt);

  await prisma.user.update({
    where: { id: usuario.id },
    data: {
      password: passwordHasheada,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  return true;
};

module.exports = {
  hashPassword,
  verifyPassword,
  crearUsuario,
  crearUsuarioCompleto,
  crearPaciente,
  crearMedico,
  crearAcompañante,
  login,
  renovarToken,
  logout,
  logoutTodasLasSesiones,
  procesarSolicitudRecuperacion,
  ejecutarCambioContrasena,
};
