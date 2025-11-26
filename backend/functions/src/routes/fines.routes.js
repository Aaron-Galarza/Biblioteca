import express from "express";
import { getMultas, crearMulta, cancelarMulta } from "../controllers/fines.controller.js";

import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Listar multas activas
router.get("/", verifyToken, isAdmin, getMultas);                                 // Protected route (Admin)

// Crear nueva multa
router.post("/", verifyToken, isAdmin, crearMulta);                               // Protected route (Admin)

// Cancelar multa
router.put("/:idMulta/cancelar", verifyToken, isAdmin, cancelarMulta);            // Protected route (Admin)

export default router;