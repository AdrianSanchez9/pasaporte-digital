

const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!rolesPermitidos.includes(req.user.rolNombre)) {
      return res.status(403).json({
        error: 'Sin permisos',
        message: 'No tienes permiso para acceder al recurso'
      });
    }

    next();
  };
};


module.exports = { requireRole };
