
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function limpiarBaseDeDatos() {
  try {
    console.log('🧹 Iniciando limpieza de la base de datos...');

    await prisma.acompanante.deleteMany();
    await prisma.medico.deleteMany();
    await prisma.paciente.deleteMany();

    await prisma.user.deleteMany();

    console.log('✅ ¡Todos los datos de prueba fueron eliminados con éxito!');
  } catch (error) {
    console.error('❌ Error limpiando la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

limpiarBaseDeDatos();
