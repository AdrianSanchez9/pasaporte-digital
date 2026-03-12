

const renderHome = (req, res) => {
  res.render('index', {
    title: 'Pasaporte Médico Digital',
  });
};

const renderLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Iniciar Sesión',
    error: null,
  });
};

const renderRegistro = (req, res) => {
  res.render('auth/registro', {
    title: 'Registrarse',
    error: null,
  });
};

const renderDashboard = (req, res) => {
  // req.user viene del middleware auth (tiene toda la info del JWT)
  const { nombre, apellido, rolNombre } = req.user;

  res.render('dashboard', {
    title: 'Dashboard',
    user: {
      nombre,
      apellido,
      rol: rolNombre,
    },
  });
};

module.exports = {
  renderHome,
  renderLogin,
  renderRegistro,
};
