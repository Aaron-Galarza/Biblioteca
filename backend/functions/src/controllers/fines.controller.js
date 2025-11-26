import * as MultaService from "../services/fines.service.js";

export const getMultas = async (req, res) => {
  try {
    const multas = await MultaService.obtenerMultas();
    res.json(multas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearMulta = async (req, res) => {
  try {
    const multa = await MultaService.crearMulta(req.body);
    res.status(201).json({ msg: "Multa registrada correctamente", multa });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cancelarMulta = async (req, res) => {
  try {
    const { idMulta } = req.params;
    const resultado = await MultaService.cancelarMulta(idMulta);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};