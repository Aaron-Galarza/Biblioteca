import * as SocioService from "../services/socioService.js";

// GET Partner
export const getSocios = async (req, res) => {
  try {
    const socios = await SocioService.obtenerSocios();
    res.json(socios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET Partner by ID
export const getSocioById = async (req, res) => {
  try {
    const { id } = req.params;
    const socio = await SocioService.obtenerSocioPorId(id);
    res.json(socio);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// POST Partner
export const crearSocio = async (req, res) => {
  try {
    const { nombre, dni, email, telefono } = req.body;
    const socio = await SocioService.registrarSocio({ nombre, dni, email, telefono });
    res.json(socio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT Partner
export const actualizarSocio = async (req, res) => {
  try {
    const { id } = req.params;
    const socio = await SocioService.actualizarSocio(id, req.body);
    res.json(socio);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// DELETE Partner
export const eliminarSocio = async (req, res) => {
  try {
    const { id } = req.params;
    await SocioService.eliminarSocio(id);
    res.json({ msg: "Socio eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};