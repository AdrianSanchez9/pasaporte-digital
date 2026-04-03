const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Ej: pasaporte.medico.ong@gmail.com
    pass: process.env.EMAIL_PASS  // La contraseña de aplicación de 16 letras de Google
  }
});

// 2. Creás la función reutilizable
const enviarCredencialesAlta = async (emailDestino, passwordTemporal) => {
  const mailOptions = {
    from: '"Pasaporte Médico" <seminario.ong2026@gmail.com>', // Remitente
    to: emailDestino,                                             // Destinatario
    subject: 'Bienvenido - Tus credenciales de acceso',           // Asunto
    html: `
      <div style="font-family: sans-serif; color: #333;">
        <h2>¡Bienvenido a Pasaporte Médico!</h2>
        <p>Un administrador ha creado tu cuenta en el sistema.</p>
        <p>Tu contraseña temporal de acceso es: <strong>${passwordTemporal}</strong></p>
        <br>
        <p><em>Por seguridad, el sistema te pedirá cambiar esta contraseña la primera vez que inicies sesión.</em></p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  enviarCredencialesAlta
};
