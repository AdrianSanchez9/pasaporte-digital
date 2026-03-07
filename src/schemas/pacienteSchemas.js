
const { z } = require('zod');

const actualizarPerfilPacienteSchema = z.object({
  apodo: z.string().min(2, 'El apodo debe tener al menos 2 caracteres').optional(),
  nroObraSocial: z.string().optional(),
  fechaNacimiento: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  necesidadesReligiosas: z.string().optional(),
  medicoCabeceraId: z.string().uuid('ID de médico inválido').optional().nullable(),
});

// ─── Schema para crear/editar contacto de paciente ────────────────────────────
const contactoPacienteSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  relacion: z.string().optional(),
});

module.exports = {
  actualizarPerfilPacienteSchema,
  contactoPacienteSchema,
};
