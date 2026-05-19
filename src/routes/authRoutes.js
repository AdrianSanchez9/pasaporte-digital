const express = require("express");
const router = express.Router();
const {
  registro,
  registroNuevo,
  login,
  refresh,
  logout,
  logoutAll,
  me,
  renderLoginForm,
  renderRegistroForm,
  recuperarContrasena,
  cambiarContrasenaRestauracion,
} = require("../controllers/auth/authController");
const { auth, isAuthenticated } = require("../middleware/auth");
const { requireRole } = require("../middleware/authorize");
const { validateSchema } = require("../middleware/validateSchema");
const { loginSchema, refreshTokenSchema } = require("../schemas/authSchemas");

const {
  renderHome,
  renderLogin,
  renderRegistro,
} = require("../controllers/viewController");

router.get("/registro", auth, requireRole("ADMIN"), renderRegistroForm);

router.post("/registro", auth, requireRole("ADMIN"), registroNuevo);

router.get("/login", isAuthenticated, renderLogin);

router.post("/login", isAuthenticated, validateSchema(loginSchema), login);

router.post("/refresh", refresh);

router.post("/logout", auth, logout);

router.get("/recuperar-contrasena", (req, res) =>
  res.render("auth/recuperar-contrasena"),
);

router.post("/recuperar-contrasena", recuperarContrasena);

router.get("/restaurar-contrasena/:token", (req, res) => {
  res.render("auth/resetear-contrasena", { token: req.params.token });
});

router.post("/restaurar-contrasena/:token", cambiarContrasenaRestauracion);

module.exports = router;
