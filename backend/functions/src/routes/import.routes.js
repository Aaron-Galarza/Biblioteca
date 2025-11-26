// ..backend/functions/src/routes/importRoutes.js

import { Router } from "express";
import { loadInitialData } from "../controllers/import.controller.js";

const router = Router();

// Ruta para ejecutar la carga de datos iniciales (solo en desarrollo)
router.post("/load-data", loadInitialData);

export default router;