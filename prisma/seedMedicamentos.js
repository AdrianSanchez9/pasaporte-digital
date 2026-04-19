const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Catálogo de medicamentos comunes
const medicamentos = [
  // Analgésicos
  'Paracetamol',
  'Ibuprofeno',
  'Aspirina',
  'Diclofenac',
  'Tramadol',
  'Ketorolac',

  // Antibióticos
  'Amoxicilina',
  'Azitromicina',
  'Ciprofloxacina',
  'Claritromicina',
  'Penicilina',
  'Cefalexina',

  // Antiinflamatorios
  'Naproxeno',
  'Meloxicam',
  'Piroxicam',
  'Celecoxib',

  // Antihipertensivos
  'Enalapril',
  'Losartán',
  'Amlodipina',
  'Atenolol',
  'Carvedilol',

  // Antidiabéticos
  'Metformina',
  'Glibenclamida',
  'Insulina',

  // Antiácidos
  'Omeprazol',
  'Ranitidina',
  'Pantoprazol',

  // Antialérgicos
  'Loratadina',
  'Cetirizina',
  'Desloratadina',

  // Broncodilatadores
  'Salbutamol',
  'Teofilina',

  // Anticoagulantes
  'Warfarina',
  'Rivaroxabán',

  // Estatinas
  'Atorvastatina',
  'Simvastatina',

  // Anticonvulsivantes
  'Carbamazepina',
  'Ácido Valproico',
  'Fenitoína',

  // Ansiolíticos
  'Alprazolam',
  'Clonazepam',
  'Diazepam',

  // Antidepresivos
  'Sertralina',
  'Fluoxetina',
  'Escitalopram',

  // Corticoides
  'Prednisona',
  'Dexametasona',
  'Hidrocortisona',

  // Otros
  'Levotiroxina',
  'Vitamina D',
  'Ácido Fólico',
  'Complejo B',
];

async function seedMedicamentos() {
  console.log('Iniciando seed de medicamentos...');

  let creados = 0;
  let existentes = 0;

  for (const nombre of medicamentos) {
    const medicamento = await prisma.medicamento.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });

    if (medicamento) {
      const accion = await prisma.medicamento.count({
        where: { nombre },
      }) === 1 ? 'creado' : 'existente';

      if (accion === 'creado') {
        creados++;
      } else {
        existentes++;
      }
    }
  }

  console.log(`${creados} medicamentos creados`);
  console.log(` ${existentes} medicamentos ya existían`);
  console.log(` Total: ${medicamentos.length} medicamentos en el catálogo`);
  console.log('\n Seed de medicamentos completado');
}

module.exports = seedMedicamentos;
