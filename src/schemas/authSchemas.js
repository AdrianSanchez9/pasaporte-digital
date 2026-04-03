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
  email: z.string().email('Email inválido').toLowerCase().trim(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  rolNombre: z.enum(['PACIENTE', 'MEDICO', 'ACOMPANANTE', 'ENFERMERO', 'USUARIO_EXTERNO', 'ADMIN']),

  especialidad: z.string().optional(),
  pacienteId: z.string().uuid().or(z.literal('')).optional(),

});

const actualizacionDatosUsuarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres')
});


const actualizacionContrasenaUsuarioSchema = z.object({
  password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Debe contener mayúscula, minúscula y número'
      ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden.',
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
  actualizacionContrasenaUsuarioSchema,
  actualizacionDatosUsuarioSchema,
};
