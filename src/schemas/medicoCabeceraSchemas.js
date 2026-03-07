const { z } = require('zod');

const crearMedicoCabeceraSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});

const actualizarMedicoCabeceraSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});

module.exports = {
  crearMedicoCabeceraSchema,
  actualizarMedicoCabeceraSchema,
};
