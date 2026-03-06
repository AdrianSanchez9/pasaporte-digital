const { verifyAccessToken } = require('../config/jwt');


const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      if (error.message === 'Token expirado') {
        return res.status(401).json({
          error: 'Token expirado',
          message: 'Tu sesión expiró. Renovando...'
        });
      }

      return res.status(401).json({
        error: 'Token inválido'
      });
    }

    req.user = payload;
    next();

  } catch (error) {
    return res.status(500).json({ error: 'Error de autenticación' });
  }
};


module.exports = { auth };
