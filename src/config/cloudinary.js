const cloudinary = require('cloudinary');
const  CloudinaryStorage  = require('multer-storage-cloudinary');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ong_pasaporte_pacientes',

    resource_type: 'auto',

    params: async (req, file) => {

        // 1. Armamos nuestras variables acá afuera
        const pacienteId = req.params.id || 'sin-id';
        const miUuid = uuidv4().substring(0, 6);

        // 2. Limpiamos el nombre original (le sacamos la extensión y reemplazamos espacios por guiones bajos)
        // Esto evita que si suben "Mi Receta (1).pdf" se rompa la URL
        const nombreOriginalLimpio = file.originalname
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9]/g, "_");

        // 3. Devolvemos el objeto de configuración totalmente masticado y en formato texto
        return {
          folder: 'ong_pasaporte_pacientes',
          resource_type: 'auto',
          public_id: `${pacienteId}_${miUuid}_${nombreOriginalLimpio}`
        };
      },
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
