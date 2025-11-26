import { error } from "firebase-functions/logger";
import * as LibroService from "../services/libroService.js";

// GET all Books - with filters
export const getLibros = async (req, res) => {
  try {
    const { titulo, autor, estado } = req.query
    const libros = await LibroService.getLibros({ titulo, autor, estado });
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET Book by ID
export const getLibroById = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await LibroService.obtenerLibroPorId(id);
    res.json(libro);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// POST new Book
export const crearLibro = async (req, res) => {
  try {
    const nuevoLibro = await LibroService.crearLibro(req.body);
    res.status(201).json({ msg: "Libro agregado correctamente", nuevoLibro });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT Books
export const actualizarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const libroActualizado = await LibroService.actualizarLibro(id, req.body);
    res.json({ msg: "Libro actualizado correctamente", libroActualizado });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// DELETE Book
export const eliminarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    await LibroService.eliminarLibro(id);
    res.json({ msg: "Libro eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const reservarLibro = async (req, res) => {
  try {
    const {id} = req.params
    const idLibro = id
    const {idSocio} = req.body

    if (!idLibro) {
      return res.json({error: "id del libro es obligatorio"})
    }

    if (!idSocio) {
      return res.json({error: "id del socio es obligatorio"})
    }
    
    const reserva = await LibroService.postReserva({idLibro, idSocio})
    return res.json(reserva)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

