const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedRoles = require('./seedRoles');
const seedMedicamentos = require('./seedMedicamentos');

async function main() {
  console.log('Proceso...');

  try {
    await seedRoles(prisma);
    console.log('Roles cargados.');

    await seedMedicamentos(prisma);
    console.log('Catálogo de medicamentos cargado.');

    console.log('Se cargaron todos los datos.');
  } catch (e) {
    console.error('❌ Error en el Seeding:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
