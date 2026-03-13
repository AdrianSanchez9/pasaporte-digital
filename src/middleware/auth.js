const { verifyAccessToken } = require('../config/jwt');


const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) { return res.redirect('/auth/login'); }

    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch (error) {
        return res.redirect('/auth/login');
    }

    req.user = payload;
    next();

  } catch (error) {
    return res.redirect('/auth/login');
  }

};


module.exports = { auth };
