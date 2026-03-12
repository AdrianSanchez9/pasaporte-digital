const prisma = require('../config/database');


const obtenerCuidadoPersonal = async (pacienteId) => {
  let cuidado = await prisma.cuidadoPersonal.findUnique({
    where: { pacienteId },
  });

  if (!cuidado) {
    cuidado = await prisma.cuidadoPersonal.create({
      data: { pacienteId },
    });
  }

  return cuidado;
};

const actualizarCuidadoPersonal = async (pacienteId, datos) => {
  await obtenerCuidadoPersonal(pacienteId);

  return await prisma.cuidadoPersonal.update({
    where: { pacienteId },
    data: datos,
  });
};

const obtenerPerfilComunicacion = async (pacienteId) => {
  let perfil = await prisma.perfilComunicacion.findUnique({
    where: { pacienteId },
  });

  if (!perfil) {
    perfil = await prisma.perfilComunicacion.create({
      data: { pacienteId },
    });
  }

  return perfil;
};

const actualizarPerfilComunicacion = async (pacienteId, datos) => {
  await obtenerPerfilComunicacion(pacienteId);

  return await prisma.perfilComunicacion.update({
    where: { pacienteId },
    data: datos,
  });
};

const obtenerEmociones = async (pacienteId) => {
  let emociones = await prisma.emociones.findUnique({
    where: { pacienteId },
  });

  if (!emociones) {
    emociones = await prisma.emociones.create({
      data: { pacienteId },
    });
  }

  return emociones;
};

const actualizarEmociones = async (pacienteId, datos) => {
  await obtenerEmociones(pacienteId);

  return await prisma.emociones.update({
    where: { pacienteId },
    data: datos,
  });
};

const listarGustos = async (pacienteId) => {
  return await prisma.gustoPaciente.findMany({
    where: { pacienteId },
    orderBy: { createdAt: 'desc' },
  });
};

const crearGusto = async (pacienteId, datos) => {
  return await prisma.gustoPaciente.create({
    data: {
      ...datos,
      pacienteId,
    },
  });
};

const actualizarGusto = async (gustoId, pacienteId, datos) => {
  // Verificar que el gusto pertenece al paciente
  const gusto = await prisma.gustoPaciente.findFirst({
    where: {
      id: gustoId,
      pacienteId,
    },
  });

  if (!gusto) {
    throw new Error('Gusto no encontrado');
  }

  return await prisma.gustoPaciente.update({
    where: { id: gustoId },
    data: datos,
  });
};

const eliminarGusto = async (gustoId, pacienteId) => {
  const gusto = await prisma.gustoPaciente.findFirst({
    where: {
      id: gustoId,
      pacienteId,
    },
  });

  if (!gusto) {
    throw new Error('Gusto no encontrado');
  }

  return await prisma.gustoPaciente.delete({
    where: { id: gustoId },
  });
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
