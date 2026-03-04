const prisma = require('../config/database');

const verificarEmailDisponible = async (email) => {
  const usuarioExistente = await prisma.user.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }

  return true;
};


const verificarPacienteExiste = async (pacienteId) => {
  if (!pacienteId) {
    throw new Error('El ID del paciente es obligatorio para acompañantes');
  }

  const paciente = await prisma.paciente.findUnique({
    where: { userId: pacienteId },
  });

  if (!paciente) {
    throw new Error('El paciente especificado no existe');
  }

  return paciente;
};

// ─── Verificar que el rol exista ──────────────────────────────────────────────
const verificarRolExiste = async (rolNombre) => {
  const rol = await prisma.role.findUnique({
    where: { nombre: rolNombre },
  });

  if (!rol) {
    throw new Error(`El rol "${rolNombre}" no existe en el sistema`);
  }

  return rol;
};

const verificarUsuarioActivo = (user) => {
  if (!user.activo) {
    throw new Error('Usuario deshabilitado. Contactá al administrador.');
  }

  return true;
};

const verificarDniDisponible = async (dni) => {
  if (!dni) {
    return true; // DNI es opcional en algunos casos
  }

  const pacienteConDni = await prisma.paciente.findUnique({
    where: { dni },
  });

  if (pacienteConDni) {
    throw new Error('El DNI ya está registrado en el sistema');
  }

  const acompañanteConDni = await prisma.acompañante.findUnique({
    where: { dni },
  });

  if (acompañanteConDni) {
    throw new Error('El DNI ya está registrado en el sistema');
  }

  return true;
};

const verificarMatriculaDisponible = async (matricula) => {
  if (!matricula) {
    return true; // Matrícula opcional al momento del registro
  }

  const medicoConMatricula = await prisma.medico.findUnique({
    where: { matricula },
  });

  if (medicoConMatricula) {
    throw new Error('La matrícula ya está registrada en el sistema');
  }

  return true;
};

module.exports = {
  verificarEmailDisponible,
  verificarPacienteExiste,
  verificarUsuarioActivo,
  verificarDniDisponible,
  verificarRolExiste,
  verificarMatriculaDisponible,
};
