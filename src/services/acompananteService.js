const prisma = require('../config/database');


const obtenerIdPaciente = async (idAcompanante) => {

  return await prisma.acompanante.findUnique ({
    where : {userId : idAcompanante},
    select : {pacienteId : true}
  });

};


const obtenerInformacionAcompanante = async (idAcompanante) => {

  return await prisma.acompanante.findUnique({
    where: { userId: idAcompanante }
  });

}

module.exports = { obtenerIdPaciente,obtenerInformacionAcompanante } ;
