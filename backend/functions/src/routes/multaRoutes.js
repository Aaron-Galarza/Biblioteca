import express from "express";
import { getMultas, crearMulta, cancelarMulta } from "../controllers/multaController.js";

const router = express.Router();

// Listar multas activas
router.get("/", getMultas);

// Crear nueva multa
router.post("/", crearMulta);

// Cancelar multa
router.put("/:idMulta/cancelar", cancelarMulta);

export default router;