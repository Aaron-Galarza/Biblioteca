import * as LibroService from "../services/libroService.js";

// Obtener todos los libros
export const getLibros = async (req, res) => {
  try {
    const libros = await LibroService.obtenerLibros();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener libro por ID
export const getLibroById = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await LibroService.obtenerLibroPorId(id);
    res.json(libro);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Crear un nuevo libro
export const crearLibro = async (req, res) => {
  try {
    const nuevoLibro = await LibroService.crearLibro(req.body);
    res.status(201).json({ msg: "Libro agregado correctamente", nuevoLibro });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar libro existente
export const actualizarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const libroActualizado = await LibroService.actualizarLibro(id, req.body);
    res.json({ msg: "Libro actualizado correctamente", libroActualizado });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Eliminar libro
export const eliminarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    await LibroService.eliminarLibro(id);
    res.json({ msg: "Libro eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};