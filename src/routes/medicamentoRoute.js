const express = require("express");
const router = express.Router();
const medicamentoService = require("../services/medicamentoService");

const { auth } = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const { search } = req.query;
    const resultado = await medicamentoService.listarMedicamentos({
      search,
      limit: 10,
    });
    res.json(resultado.medicamentos);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar medicamentos" });
  }
});

module.exports = router;
