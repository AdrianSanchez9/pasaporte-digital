const prisma = require("../config/database");
const cloudinary = require("cloudinary").v2;

const obtenerPerfilCompleto = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      rol: true,
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  let perfilCompleto = {
    usuario: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol.nombre,
      activo: user.activo,
      createdAt: user.createdAt,
    },
  };

  if (user.rol.nombre === "PACIENTE") {
    const paciente = await prisma.paciente.findUnique({
      where: { userId },
      include: {
        contactos: {
          orderBy: { createdAt: "desc" },
        },

        medicoCabecera: true,

        historial: {
          include: {
            medicamentos: {
              include: {
                medicamento: true,
              },
              orderBy: { createdAt: "desc" },
            },
            archivosAdjuntos: {
              orderBy: { fechaCarga: "desc" },
            },
          },
        },

        cuidadoPersonal: true,

        perfilComunicacion: true,

        emociones: true,

        acompanantes: {
          include: {
            user: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
              },
            },
          },
        },
      },
    });

    perfilCompleto.paciente = paciente;
  }

  // 4. Si es MEDICO, traer su información
  if (user.rol.nombre === "MEDICO") {
    const medico = await prisma.medico.findUnique({
      where: { userId },
    });

    perfilCompleto.medico = medico;
  }

  // 5. Si es ACOMPAÑANTE, traer su información y paciente asociado
  if (user.rol.nombre === "ACOMPAÑANTE") {
    const acompanante = await prisma.acompañante.findUnique({
      where: { userId },
      include: {
        paciente: {
          include: {
            user: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
              },
            },
          },
        },
      },
    });

    perfilCompleto.acompanante = acompanante;
  }

  return perfilCompleto;
};

const datosUsuario = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      rol: true,
      // Usamos los nombres que Prisma nos marcó con el signo "?" en el error
      datosMedico: true,
      datosAcompanante: {
        include: {
          paciente: {
            include: { user: true },
          },
        },
      },
    },
  });
};

const actualizarDatosPersonales = async (userId, datos) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      nombre: datos.nombre,
      apellido: datos.apellido,
    },
  });
};

const actualizarPassword = async (userId, hashedPassword) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });
};

module.exports = {
  obtenerPerfilCompleto,
  actualizarPassword,
  actualizarDatosPersonales,
  datosUsuario,
};
