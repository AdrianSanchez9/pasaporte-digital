require('dotenv').config(); // Cargar variables de entorno ANTES que todo

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const authRoutes = require('./src/routes/authRoutes');
const pacienteRoutes = require('./src/routes/pacienteRoutes');
const medicoCabeceraRoutes = require('./src/routes/medicoCabeceraRoutes');
const historialPacienteRoutes = require('./src/routes/historialRoutes');
const perfilCompletoRoutes = require('./src/routes/perfilCompletoRoutes');
const perfilRoutes = require('./src/routes/perfilRoutes');
const viewRoutes = require('./src/routes/viewRoutes'); // ← NUEVO


const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.set('layout', 'layouts/main');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static('public'));

// ─── Rutas ────────────────────────────────────────────────────────────────────

app.use('/', viewRoutes);
app.use('/auth', authRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/medicos-cabecera', medicoCabeceraRoutes);
app.use('/historial', historialPacienteRoutes);
app.use('/perfil-paciente', perfilCompletoRoutes);
app.use('/perfil', perfilRoutes);



// ─── Manejo de rutas no encontradas (404) ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('error/404', {
    title: 'Página no encontrada',
    user: req.user || null // Por si querés mostrar el header con el usuario
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
