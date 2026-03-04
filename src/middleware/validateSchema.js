const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);

      req.body = validated;

      next();
    } catch (error) {
      if (error.errors) {
        const errores = error.errors.map((err) => ({
          campo: err.path.join('.'),
          mensaje: err.message,
        }));

        return res.status(400).json({
          error: 'Validación fallida',
          errores,
        });
      }

      return res.status(400).json({
        error: 'Error de validación',
        mensaje: error.message,
      });
    }
  };
};

module.exports = { validateSchema };
