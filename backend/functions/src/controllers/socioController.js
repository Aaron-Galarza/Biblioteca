import * as SocioService from "../services/socioService.js";

// Obtener todos los socios
export const getSocios = async (req, res) => {
  try {
    const socios = await SocioService.obtenerSocios();
    res.json(socios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener socio por ID
export const getSocioById = async (req, res) => {
  try {
    const { id } = req.params;
    const socio = await SocioService.obtenerSocioPorId(id);
    res.json(socio);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Crear nuevo socio 
export const crearSocio = async (req, res) => {
  try {
    const { nombre, dni, email, telefono } = req.body;

    // Validaciones básicas
    if (!nombre || !dni) {
      return res.status(400).json({ error: "El nombre y el DNI son obligatorios" });
    }

    const socio = await SocioService.registrarSocio({ nombre, dni, email, telefono });
    res.status(201).json({
      msg: "Socio registrado correctamente",
      socio,
    });
  } catch (error) {
    console.error("Error en crearSocio:", error);
    res.status(400).json({ error: error.message });
  }
};

// Actualizar socio existente
export const actualizarSocio = async (req, res) => {
  try {
    const { id } = req.params;
    const socio = await SocioService.actualizarSocio(id, req.body);
    res.json({ msg: "Socio actualizado correctamente", socio });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Eliminar socio
export const eliminarSocio = async (req, res) => {
  try {
    const { id } = req.params;
    await SocioService.eliminarSocio(id);
    res.json({ msg: "Socio eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};