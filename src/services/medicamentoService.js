const prisma = require('../config/database');

const listarMedicamentos = async ({ search, limit = 100, offset = 0 }) => {
  const where = search
    ? {
        nombre: { contains: search },
      }
    : {};

  const [medicamentos, total] = await Promise.all([
    prisma.medicamento.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { nombre: 'asc' },
    }),
    prisma.medicamento.count({ where }),
  ]);

  return { medicamentos, total };
};

const buscarMedicamentoId = async (medicamentoId) => {
  const medicamento = await prisma.medicamento.findUnique({
    where: { id: medicamentoId }
  });

  if (!medicamento) {
    throw new Error('El medicamento seleccionado no existe en el catálogo');
  }

  return medicamento;
};

module.exports = {
  listarMedicamentos,
  buscarMedicamentoId,
};
