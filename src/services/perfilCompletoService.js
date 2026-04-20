const prisma = require("../config/database");

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
  let emociones = await prisma.emocionesGustos.findUnique({
    where: { pacienteId },
  });

  if (!emociones) {
    emociones = await prisma.emocionesGustos.create({
      data: { pacienteId },
    });
  }

  return emociones;
};

const actualizarEmociones = async (pacienteId, datos) => {
  await obtenerEmociones(pacienteId);

  return await prisma.emocionesGustos.update({
    where: { pacienteId },
    data: datos,
  });
};

module.exports = {
  obtenerCuidadoPersonal,
  actualizarCuidadoPersonal,
  obtenerPerfilComunicacion,
  actualizarPerfilComunicacion,
  obtenerEmociones,
  actualizarEmociones,
};
