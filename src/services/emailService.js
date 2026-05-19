const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const enviarCredencialesAlta = async (emailDestino, passwordTemporal) => {
  const mailOptions = {
    from: '"Pasaporte Médico" <seminario.ong2026@gmail.com>', // Remitente
    to: emailDestino, // Destinatario
    subject: "Bienvenido - Tus credenciales de acceso", // Asunto
    html: `
      <div style="font-family: sans-serif; color: #333;">
        <h2>¡Bienvenido a Pasaporte Médico!</h2>
        <p>Un administrador ha creado tu cuenta en el sistema.</p>
        <p>Tu contraseña temporal de acceso es: <strong>${passwordTemporal}</strong></p>
        <br>
        <p><em>Por seguridad, el sistema te pedirá cambiar esta contraseña la primera vez que inicies sesión.</em></p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

const enviarRecuperarContrasena = async (emailDestino, resetUrl) => {
  const mailOptions = {
    from: '"Pasaporte Médico" <seminario.ong2026@gmail.com>', // Remitente
    to: emailDestino, // Destinatario
    subject: "Recuperación de contraseña", // Asunto
    html: `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">

        <h2 style="color: #1e293b; margin-top: 0;">Recuperación de Contraseña</h2>

        <p>Hola!</p>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Pasaporte Médico - Asociación Azul</strong>.</p>

        <p>Hacé clic en el siguiente botón para crear una nueva:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #1e293b; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Restablecer mi contraseña
          </a>
        </div>

        <p><em>Este enlace por seguridad es válido únicamente por 1 hora.</em></p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">

        <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
          Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br>
          <a href="${resetUrl}" style="color: #4f46e5; word-break: break-all;">${resetUrl}</a>
        </p>

        <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
          Si no solicitaste este cambio, podés ignorar este correo tranquilamente. Tu contraseña seguirá siendo la misma y tu cuenta está segura.
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  enviarCredencialesAlta,
  enviarRecuperarContrasena,
};
