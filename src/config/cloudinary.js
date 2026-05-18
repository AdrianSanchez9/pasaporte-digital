const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//STORAGE PARA PERFILES
const storagePerfil = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ong_pasaporte_pacientes/perfiles",
    resource_type: "image",
  },
});

//STORAGE PARA ESTUDIOS MÉDICOS
const storageEstudios = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ong_pasaporte_pacientes/estudios",
    resource_type: "auto",
  },
});

module.exports = {
  uploadPerfil: multer({ storage: storagePerfil }),
  uploadEstudios: multer({ storage: storageEstudios }),
};
