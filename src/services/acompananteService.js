const prisma = require('../config/database');


const obtenerIdPaciente = async (idAcompanante) => {

  return await prisma.acompanante.findUnique ({
    where : {userId : idAcompanante},
    select : {pacienteId : true}
  });

};

module.exports = { obtenerIdPaciente } ;
