const prisma = require("../config/database");
const cloudinary = require("cloudinary").v2;

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
          apellido: "asc",
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
        },
      },
    },
    orderBy: {
      user: { nombre: "asc" },
    },
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
        orderBy: { createdAt: "desc" },
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
    orderBy: { createdAt: "desc" },
  });
};

const asignarMedicoCabecera = async (pacienteId, medicoCabeceraId) => {
  const medico = await prisma.medicoCabecera.findUnique({
    where: { id: medicoCabeceraId },
  });

  if (!medico) {
    throw new Error("Médico de cabecera no encontrado");
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
      pacienteId,
    },
  });
};

const actualizarContacto = async (contactoId, pacienteId, datos) => {
  const contacto = await prisma.contactoPaciente.findFirst({
    where: { id: contactoId, pacienteId }, // ← directo
  });
  if (!contacto) throw new Error("Contacto no encontrado");

  return await prisma.contactoPaciente.update({
    where: { id: contactoId },
    data: datos,
  });
};

const eliminarContacto = async (contactoId, pacienteId) => {
  const contacto = await prisma.contactoPaciente.findFirst({
    where: { id: contactoId, pacienteId },
  });
  if (!contacto) throw new Error("Contacto no encontrado");

  return await prisma.contactoPaciente.delete({
    where: { id: contactoId },
  });
};

const actualizarFotoPerfil = async (pacienteId, urlCloudinary) => {
  const paciente = await prisma.paciente.findUnique({
    where: { userId: pacienteId },
  });

  if (paciente && paciente.fotoPerfil) {
    try {
      const urlVieja = paciente.fotoPerfil;
      const partes = urlVieja.split("/upload/");

      if (partes.length === 2) {
        const rutaLimpia = partes[1].replace(/^v\d+\//, "");
        const publicIdViejo = rutaLimpia.substring(
          0,
          rutaLimpia.lastIndexOf("."),
        );

        await cloudinary.uploader.destroy(publicIdViejo);
      }
    } catch (error) {
      console.error("Error al intentar borrar la foto vieja:", error);
    }
  }

  await prisma.paciente.update({
    where: { userId: pacienteId },
    data: { fotoPerfil: urlCloudinary },
  });

  return urlCloudinary;
};

const vincularAcompanante = async (pacienteId, emailAcompanante) => {
  const usuario = await prisma.user.findUnique({
    where: { email: emailAcompanante },
    include: {
      datosAcompanante: true,
      rol: true,
    },
  });

  if (!usuario) {
    throw new Error("No se encontró ningún usuario registrado con ese email.");
  }

  if (!usuario.datosAcompanante) {
    throw new Error(
      "El usuario encontrado no tiene un perfil de persona de apoyo.",
    );
  }

  if (usuario.datosAcompanante.pacienteId) {
    throw new Error("Este usuario ya está asignado a otro paciente.");
  }

  const acompananteVinculado = await prisma.acompanante.update({
    where: { userId: usuario.id },
    data: { pacienteId: pacienteId },
  });

  return acompananteVinculado;
};

const desvincularAcompanante = async (pacienteId, acompananteUserId) => {
  const acompanante = await prisma.acompanante.findUnique({
    where: { userId: acompananteUserId },
  });

  if (!acompanante) {
    throw new Error("No se encontró a la persona de apoyo en el sistema.");
  }

  if (acompanante.pacienteId !== pacienteId) {
    throw new Error(
      "No tenés permisos para desvincular a esta persona de apoyo.",
    );
  }

  const acompananteDesvinculado = await prisma.acompanante.update({
    where: { userId: acompananteUserId },
    data: { pacienteId: null },
  });

  return acompananteDesvinculado;
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
  mostrarPacientes,
  actualizarFotoPerfil,
  vincularAcompanante,
  desvincularAcompanante,
};
