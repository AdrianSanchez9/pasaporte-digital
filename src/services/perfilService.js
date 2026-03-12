const prisma = require('../config/database');

const obtenerPerfilCompleto = async (userId) => {
  // 1. Buscar el usuario base
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      rol: true,
    },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // 2. Estructura base del perfil
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

  // 3. Si es PACIENTE, traer toda su información médica
  if (user.rol.nombre === 'PACIENTE') {
    const paciente = await prisma.paciente.findUnique({
      where: { userId },
      include: {
        // Contactos de emergencia
        contactos: {
          orderBy: { createdAt: 'desc' },
        },

        // Médico de cabecera
        medicoCabecera: true,

        // Historial médico con medicamentos
        historial: {
          include: {
            medicamentos: {
              include: {
                medicamento: true,
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        },

        // Cuidado personal
        cuidadoPersonal: true,

        // Perfil de comunicación
        perfilComunicacion: true,

        // Emociones
        emociones: true,

        // Gustos y preferencias
        gustos: {
          orderBy: { createdAt: 'desc' },
        },

        // Acompañantes asignados
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
  if (user.rol.nombre === 'MEDICO') {
    const medico = await prisma.medico.findUnique({
      where: { userId },
    });

    perfilCompleto.medico = medico;
  }

  // 5. Si es ACOMPAÑANTE, traer su información y paciente asociado
  if (user.rol.nombre === 'ACOMPAÑANTE') {
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

module.exports = {
  obtenerPerfilCompleto,
};
