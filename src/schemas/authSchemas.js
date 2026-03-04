const { z } = require('zod');

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'El email es obligatorio',
    })
    .email('Email inválido')
    .toLowerCase()
    .trim(),

  password: z
    .string({
      required_error: 'La contraseña es obligatoria',
    })
    .min(1, 'La contraseña no puede estar vacía'),
});


const registroSchema = z.object({
  email: z
    .string({
      required_error: 'El email es obligatorio',
    })
    .email('Email inválido')
    .toLowerCase()
    .trim(),

  password: z
    .string({
      required_error: 'La contraseña es obligatoria',
    })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),

  confirmPassword: z
    .string({
      required_error: 'Confirmar contraseña es obligatorio',
    }),

  nombre: z
    .string({
      required_error: 'El nombre es obligatorio',
    })
    .toLowerCase()
    .trim(),

  apellido: z
    .string({
      required_error: 'El apellido es obligatorio',
    })
    .toLowerCase()
    .trim(),

  rolNombre: z
    .string({
      required_error: 'El rol es obligatorio',
    })
    .refine(
      (val) => ['PACIENTE', 'MEDICO', 'ACOMPAnANTE'].includes(val),
      'Rol inválido. Debe ser PACIENTE, MEDICO o ACOMPAÑANTE'
    ),

  // Campo opcional: ID del paciente (solo para ACOMPAÑANTE)
  pacienteId: z.string().uuid('ID de paciente inválido').optional(),

}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

const refreshTokenSchema = z.object({
  refreshToken: z
    .string({
      required_error: 'El refresh token es obligatorio',
    })
    .min(1, 'El refresh token no puede estar vacío'),
});

module.exports = {
  loginSchema,
  registroSchema,
  refreshTokenSchema,
};
