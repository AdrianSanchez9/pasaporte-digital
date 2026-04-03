const crypto = require('crypto');

const generarContrasenaTemporal = () => {
  return crypto.randomBytes(10).toString('hex');
};

module.exports = {generarContrasenaTemporal}
