const { verifyAccessToken } = require('../config/jwt');


const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) { return res.redirect('/auth/login'); }

    try {
      req.user = verifyAccessToken(token);
    } catch (error) {
        return res.redirect('/auth/login');
    }
    res.locals.user = req.user;
    next();
  } catch (error) {
    return res.redirect('/auth/login');
  }

};


const isAuthenticated = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return next();
  return res.redirect('/');
};



module.exports = { auth, isAuthenticated };
