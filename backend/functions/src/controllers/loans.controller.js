import { error } from "firebase-functions/logger";
import * as PrestamoService from "../services/loans.service.js";

export const obtenerPrestamos = async (req, res) => {
  try {
    const prestamos = await PrestamoService.obtenerPrestamos();
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearPrestamo = async (req, res) => {
  try {
    const prestamo = await PrestamoService.crearPrestamo(req.body);
    res.status(201).json({ msg: "Préstamo registrado correctamente", prestamo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const devolverLibro = async (req, res) => {
  try {
    const { idPrestamo } = req.params;
    const resultado = await PrestamoService.cerrarPrestamo(idPrestamo);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const extenderLoan = async (req, res) => {
  try {
    const {idPrestamo} = req.params

    if (!idPrestamo) {
      return res.status(400).json({error: "El ID del prestamos es obligatorio"})
    }

    const nuevaFecha = await PrestamoService.extenderPrestamo(idPrestamo)
    res.json(nuevaFecha)  
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}