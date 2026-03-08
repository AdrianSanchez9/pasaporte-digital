const prisma = require('../config/database');

const listarMedicosCabecera = async ({ search, limit = 10, offset = 0 }) => {
  const where = search
    ? {
        OR: [
          { nombre: { contains: search } },
          { apellido: { contains: search } },
        ],
      }
    : {};

  const [medicos, total] = await Promise.all([
    prisma.medicoCabecera.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        apellido: 'asc',
      },
    }),
    prisma.medicoCabecera.count({ where }),
  ]);

  return { medicos, total };
};

const buscarMedicoCabeceraPorId = async (id) => {
  return await prisma.medicoCabecera.findUnique({
    where: { id },
    include: {
      pacientes: {
        include: {
          user: {
            select: {
              nombre: true,
              apellido: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

const crearMedicoCabecera = async (datos) => {
  return await prisma.medicoCabecera.create({
    data: datos,
  });
};

const actualizarMedicoCabecera = async (id, datos) => {
  return await prisma.medicoCabecera.update({
    where: { id },
    data: datos,
  });
};

const eliminarMedicoCabecera = async (id) => {
  // Verificar si tiene pacientes asignados
  const medico = await prisma.medicoCabecera.findUnique({
    where: { id },
    include: {
      _count: {
        select: { pacientes: true },
      },
    },
  });

  if (!medico) {
    throw new Error('Médico de cabecera no encontrado');
  }

  if (medico._count.pacientes > 0) {
    throw new Error(
      `No se puede eliminar. Tiene ${medico._count.pacientes} paciente(s) asignado(s)`
    );
  }

  return await prisma.medicoCabecera.delete({
    where: { id },
  });
};

module.exports = {
  listarMedicosCabecera,
  buscarMedicoCabeceraPorId,
  crearMedicoCabecera,
  actualizarMedicoCabecera,
  eliminarMedicoCabecera,
};
