const { z } = require("zod");

const actualizarCuidadoPersonalSchema = z.object({
  tipoMovilidad: z.string().optional(),
  cuidadoPersonal: z.string().optional(),
  maneraParaComer: z.string().optional(),
  maneraParaBeber: z.string().optional(),
  miSeguridad: z.string().optional(),
  usoBano: z.string().optional(),
  problemasVistaAudicion: z.string().optional(),
  rutinaDescanso: z.string().optional(),
});

const actualizarPerfilComunicacionSchema = z.object({
  asistenteComunicacion: z.string().optional(),
  ayudaComunicacion: z.string().optional(),
  lenguajesQueHabla: z.string().optional(),
  necesitaAsistente: z.preprocess(
    (val) => val === "on" || val === true,
    z.boolean().default(false),
  ),
  necesitaPersonaApoyo: z.preprocess(
    (val) => val === "on" || val === true,
    z.boolean().default(false),
  ),
});

const actualizarEmocionesSchema = z.object({
  descripcionAnsioso: z.string().optional(),
  descripcionDolor: z.string().optional(),
  descripcionAsustado: z.string().optional(),
  descripcionEnojado: z.string().optional(),
  loQueMeGusta: z.string().optional(),
  loQueNoMeGusta: z.string().optional(),
});

const crearGustoSchema = z.object({
  tipo: z.string().optional(),
  descripcion: z.string().optional(),
  notas: z.string().optional(),
  sitios: z.string().optional(),
});

const actualizarGustoSchema = z.object({
  tipo: z.string().optional(),
  descripcion: z.string().optional(),
  notas: z.string().optional(),
  sitios: z.string().optional(),
});

module.exports = {
  actualizarCuidadoPersonalSchema,
  actualizarPerfilComunicacionSchema,
  actualizarEmocionesSchema,
  crearGustoSchema,
  actualizarGustoSchema,
};
