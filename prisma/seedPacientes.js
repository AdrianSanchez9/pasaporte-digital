const { fakerES: faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

async function seedPacientes(prisma) {
  console.log("⏳ Iniciando la generación de 50 pacientes de prueba...");

  // 1. Hasheamos la contraseña genérica una sola vez por rendimiento
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 2. Buscamos el ID del rol PACIENTE (que ya debió crearse en seedRoles)
  const rolPaciente = await prisma.role.findUnique({
    where: { nombre: "PACIENTE" },
  });

  if (!rolPaciente) {
    throw new Error(
      '❌ No se encontró el rol "PACIENTE". Asegurate de correr seedRoles primero.',
    );
  }

  // 3. Bucle para crear 50 pacientes
  for (let i = 0; i < 50; i++) {
    const nombre = faker.person.firstName();
    const apellido = faker.person.lastName();

    // Le agregamos un timestamp + índice al email para garantizar que NUNCA se repita
    const email = `paciente${i}_${Date.now()}@prueba.com`;

    try {
      await prisma.user.create({
        data: {
          nombre: nombre,
          apellido: apellido,
          email: email,
          password: hashedPassword,
          rolId: rolPaciente.id,
          activo: true,

          // ESCRITURA ANIDADA: Creamos el perfil de Paciente y todos sus detalles
          datosPaciente: {
            create: {
              dni: faker.string.numeric(8),
              apodo: faker.helpers.arrayElement([
                nombre,
                null,
                "Pachi",
                "Tito",
                "Gaby",
              ]),
              nroObraSocial: faker.string.numeric(10),
              fechaNacimiento: faker.date.birthdate({
                min: 18,
                max: 85,
                mode: "age",
              }),
              direccion: faker.location.streetAddress(),
              telefono: faker.phone.number(),
              religion: faker.helpers.arrayElement([
                "Católica",
                "Evangélica",
                "Ninguna",
                null,
              ]),

              // Historial Clínico (1:1)
              historial: {
                create: {
                  alergias: faker.helpers.arrayElement([
                    "Penicilina",
                    "Ibuprofeno",
                    "Polvo",
                    "Ninguna",
                    "Lactosa",
                  ]),
                  tieneEpilepsia: faker.datatype.boolean(0.15), // 15% de probabilidad
                  tipoCrisis: "Ausencia",
                  datosExtras: "Paciente generado para pruebas de estrés.",
                },
              },

              // Contactos de Emergencia (1:N) - Genera 1 o 2 contactos por paciente
              contactos: {
                create: Array.from({
                  length: faker.number.int({ min: 1, max: 2 }),
                }).map(() => ({
                  nombre: faker.person.fullName(),
                  relacion: faker.helpers.arrayElement([
                    "Madre",
                    "Padre",
                    "Hermano/a",
                    "Tutor",
                    "Pareja",
                  ]),
                  telefono: faker.phone.number(),
                })),
              },

              // Cuidado Personal (1:1)
              cuidadoPersonal: {
                create: {
                  tipoMovilidad: faker.helpers.arrayElement([
                    "Independiente",
                    "Silla de ruedas",
                    "Bastón",
                    "Andador",
                  ]),
                  cuidadoPersonal: faker.helpers.arrayElement([
                    "Requiere asistencia en escaleras",
                    "Totalmente independiente",
                    null,
                  ]),
                },
              },

              // Emociones (1:1)
              emociones: {
                create: {
                  descripcionAsustado: faker.helpers.arrayElement([
                    "Ruidos fuertes",
                    "Mucha gente",
                    "Agujas",
                    null,
                  ]),
                  descripcionAnsioso:
                    "Mueve las manos constantemente o camina en círculos.",
                },
              },
            },
          },
        },
      });

      // Barra de progreso simple en consola
      if ((i + 1) % 10 === 0) {
        console.log(`✅ ${i + 1}/50 pacientes creados...`);
      }
    } catch (error) {
      console.error(`⚠️ Error creando al paciente ${i}:`, error.message);
    }
  }

  console.log("🎉 ¡Seed de pacientes finalizado con éxito!");
}

// Exportamos la función para poder usarla en el seed.js principal
module.exports = seedPacientes;

if (require.main === module) {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  console.log("🚀 Iniciando ejecución aislada de pacientes...");

  seedPacientes(prisma)
    .catch((e) => {
      console.error("❌ Error crítico:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      console.log("👋 Conexión a la BD cerrada.");
    });
}
