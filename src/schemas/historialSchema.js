const { z } = require("zod");

const actualizarHistorialSchema = z.object({
  alergias: z.string().optional(),
  metodosIntervencion: z.string().optional(),
  metodoLiquidosSolidos: z.string().optional(),
  posicionAdministracion: z.string().optional(),
  datosExtras: z.string().optional(),
  tieneEpilepsia: z.boolean().optional(),
  tipoCrisis: z.string().optional(),
  tieneOtrasCrisis: z.preprocess(
    (val) => val === "on" || val === true,
    z.boolean().default(false),
  ),
  descripcionOtrasCrisis: z.string().optional(),
});

const agregarMedicamentoSchema = z
  .object({
    medicamentoId: z.string().uuid("ID de medicamento inválido").optional(),

    medicamentoPersonalizado: z
      .string()
      .min(2, "El nombre del medicamento debe tener al menos 2 caracteres")
      .optional(),

    dosis: z.string().optional(),
    horarios: z.string().optional(),
    formaMedicamento: z.string().optional(),
    tipoMedicamento: z.string().optional(),
    momentoIngesta: z.string().optional(),
  })
  .refine((data) => data.medicamentoId || data.medicamentoPersonalizado, {
    message: "Debe proporcionar medicamentoId o medicamentoPersonalizado",
  })
  .refine((data) => !(data.medicamentoId && data.medicamentoPersonalizado), {
    message:
      "No puede proporcionar medicamentoId y medicamentoPersonalizado al mismo tiempo",
  });

const actualizarMedicamentoSchema = z.object({
  dosis: z.string().optional(),
  horarios: z.string().optional(),
  formaMedicamento: z.string().optional(),
  tipoMedicamento: z.string().optional(),
  momentoIngesta: z.string().optional(),
});

module.exports = {
  actualizarHistorialSchema,
  agregarMedicamentoSchema,
  actualizarMedicamentoSchema,
};
