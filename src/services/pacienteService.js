const prisma = require('../config/database');

const listarPacientes = async ({ search, limit = 10, offset = 0 }) => {
  const where = search
    ? {
        OR: [
          { user: { nombre: { contains: search } } },
          { user: { apellido: { contains: search } } },
          { user: { email: { contains: search } } },
          { apodo: { contains: search } },
          { telefono: { contains: search } },
        ],
      }
    : {};

  const [pacientes, total] = await Promise.all([
    prisma.paciente.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        medicoCabecera: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        user: {
          apellido: 'asc',
        },
      },
    }),
    prisma.paciente.count({ where }),
  ]);

  return { pacientes, total };
};

const mostrarPacientes = async ({ search }) => {
  return await prisma.paciente.findMany({
    where: { user: { activo: true } },
    select: {
      userId: true,
      user: {
        select: {
          nombre: true,
          apellido: true,
        }
      }
    },
    orderBy: {
      user: { nombre: 'asc' }
    }
  });
};



const buscarPacientePorId = async (userId) => {
  return await prisma.paciente.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          createdAt: true,
        },
      },
      medicoCabecera: true,
      contactos: {
        orderBy: { createdAt: 'desc' },
      },
      acompanantes: {
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

const actualizarPerfil = async (userId, datos) => {
  return await prisma.paciente.update({
    where: { userId },
    data: datos,
    include: {
      user: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
        },
      },
      medicoCabecera: true,
    },
  });
};

const listarContactos = async (pacienteId) => {
  return await prisma.contactoPaciente.findMany({
    where: { pacienteId },
    orderBy: { createdAt: 'desc' },
  });
};

const asignarMedicoCabecera = async (pacienteId, medicoCabeceraId) => {
  const medico = await prisma.medicoCabecera.findUnique({
    where: { id: medicoCabeceraId },
  });

  if (!medico) {
    throw new Error('Médico de cabecera no encontrado');
  }

  return await prisma.paciente.update({
    where: { userId: pacienteId },
    data: { medicoCabeceraId },
    include: {
      medicoCabecera: true,
    },
  });
};

const actualizarMiMedicoCabecera = async (pacienteId, datos) => {
  const medico = await prisma.medicoCabecera.create({
    data: datos,
  });

  return await prisma.paciente.update({
    where: { userId: pacienteId },
    data: { medicoCabeceraId: medico.id },
    include: { medicoCabecera: true },
  });
};

const actualizarMiContacto = async (pacienteId, datos) => {
  const contactoPaciente = await prisma.contactos.create({
    data: datos,
  });

  return await prisma.paciente.update({
    where: { userId: pacienteId },
    data: { medicoCabeceraId: medico.id },
    include: { contactos: true },
  });
};


const crearContacto = async (pacienteId, datos) => {
  return await prisma.contactoPaciente.create({
    data: {
      ...datos,
      pacienteId

    }
  });
};

const actualizarContacto = async (contactoId, pacienteId, datos) => {
  const contacto = await prisma.contactoPaciente.findFirst({
    where: { id: contactoId, pacienteId } // ← directo
  });
  if (!contacto) throw new Error('Contacto no encontrado');

  return await prisma.contactoPaciente.update({
    where: { id: contactoId },
    data: datos
  });
};

const eliminarContacto = async (contactoId, pacienteId) => {
  const contacto = await prisma.contactoPaciente.findFirst({
    where: { id: contactoId, pacienteId }
  });
  if (!contacto) throw new Error('Contacto no encontrado');

  return await prisma.contactoPaciente.delete({
    where: { id: contactoId }
  });
};

module.exports = {
  listarPacientes,
  buscarPacientePorId,
  actualizarPerfil,
  listarContactos,
  crearContacto,
  eliminarContacto,
  asignarMedicoCabecera,
  actualizarMiMedicoCabecera,
  crearContacto,
  actualizarContacto,
  eliminarContacto,
  mostrarPacientes
};
