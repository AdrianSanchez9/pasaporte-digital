const prisma = require('../config/database');
const { buscarMedicamentoId } = require('./medicamentoService');
const cloudinary = require('cloudinary');

const obtenerHistorial = async (pacienteId) => {

  let historial = await prisma.historialPaciente.findUnique({
    where: { pacienteId },
    include: {
      medicamentos: {
        include: {
          medicamento: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  // Si no existe, crear uno vacío
  if (!historial) {
    historial = await prisma.historialPaciente.create({
      data: { pacienteId },
      include: {
        medicamentos: {
          include: {
            medicamento: true,
          },
        },
      },
    });
  }

  return historial;
};


const actualizarHistorial = async (pacienteId, datos) => {
  await obtenerHistorial(pacienteId);

  return await prisma.historialPaciente.update({
    where: { pacienteId },
    data: datos,
    include: {
      medicamentos: {
        include: {
          medicamento: true,
        },
      },
    },
  });
};

const agregarMedicamento = async (pacienteId, datosMedicamento) => {
  const {
    medicamentoId,
    medicamentoPersonalizado,
    dosis,
    horarios,
    formaMedicamento,
    tipoMedicamento,
    momentoIngesta
  } = datosMedicamento;

  if (!medicamentoId && !medicamentoPersonalizado) {
    throw new Error('Debe proporcionar medicamentoId o medicamentoPersonalizado');
  }

  if (medicamentoId && medicamentoPersonalizado) {
    throw new Error('No puede proporcionar medicamentoId y medicamentoPersonalizado al mismo tiempo');
  }

  const historial = await obtenerHistorial(pacienteId);

  if (medicamentoId){
    await buscarMedicamentoId(medicamentoId);
  }

  const informacion = await prisma.informacionMedicamento.create({
    data: {
      historialId: historial.id,
      medicamentoId: medicamentoId || null,
      medicamentoPersonalizado: medicamentoPersonalizado || null,
      dosis,
      horarios,
      formaMedicamento,
      tipoMedicamento,
      momentoIngesta,
    },
    include: {
      medicamento: true,
    },
  });

  return informacion;
};



const actualizarMedicamento = async (informacionId, datos) => {
  return await prisma.informacionMedicamento.update({
    where: { id: informacionId },
    data: datos,
    include: {
      medicamento: true,
    },
  });
};

const eliminarMedicamento = async (informacionId, pacienteId) => {
  const historial = await obtenerHistorial(pacienteId);

  const informacion = await prisma.informacionMedicamento.findFirst({
    where: {
      id: informacionId,
      historialId: historial.id,
    },
  });

  if (!informacion) {
    throw new Error('Medicamento no encontrado en el historial del paciente');
  }

  return await prisma.informacionMedicamento.delete({
    where: { id: informacionId },
  });
};


const eliminarArchivoNube = async (uuid) => {
  try {
    const resultado = await cloudinary.uploader.destroy(uuid);

    if (resultado.result !== 'ok' && resultado.result !== 'not found') {
      throw new Error('Cloudinary no pudo procesar la eliminación');
    }

    return true;
  } catch (error) {
    console.error('Error interno de Cloudinary:', error);
    throw new Error('Fallo la comunicación con la nube al eliminar');
  }
};

const eliminarArchivoBd = async (archivoId) => {
  const archivo = await prisma.archivoAdjunto.findUnique({
    where: { id: archivoId },
    include: { historial: true }
  });

  if (!archivo) {
    throw new Error('El archivo no existe en la base de datos');
  }

  const pacienteId = archivo.historial.pacienteId;


  await prisma.$transaction(async (tx) => {
    await tx.archivoAdjunto.delete({
      where: { id: archivoId }
    });
    await eliminarArchivoNube(archivo.uuid);
  });

  return pacienteId;
};

module.exports = {
  obtenerHistorial,
  actualizarHistorial,
  agregarMedicamento,
  actualizarMedicamento,
  eliminarMedicamento,
  eliminarArchivoBd,
  eliminarArchivoNube,
};
