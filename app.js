require('dotenv').config(); // Cargar variables de entorno ANTES que todo

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const authRoutes = require('./src/routes/authRoutes');
const pacienteRoutes = require('./src/routes/pacienteRoutes');
const medicoCabeceraRoutes = require('./src/routes/medicoCabeceraRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logs: GET /auth/login 200 15ms
}

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static('public'));

// ─── Rutas ────────────────────────────────────────────────────────────────────

app.use('/auth', authRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/medicos-cabecera', medicoCabeceraRoutes);


app.get('/', (req, res) => {
  res.json({
    mensaje: '🏥 API de Pasaporte Médico',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
    },
  });
});

// ─── Manejo de rutas no encontradas (404) ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `La ruta ${req.method} ${req.originalUrl} no existe`,
  });
});

// ─── Manejo global de errores ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);

  res.status(err.status || 500).json({
    error: 'Error del servidor',
    mensaje: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Ocurrió un error inesperado',
  });
});

// ─── Iniciar servidor ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║   🏥 Servidor corriendo en ${process.env.BASE_URL || `http://localhost:${PORT}`}     ║
║   📝 Entorno: ${process.env.NODE_ENV || 'development'}                        ║
║   🗄️  Base de datos: MySQL                             ║
╚════════════════════════════════════════════════════════╝
  `);
});

module.exports = app; // Para testin
