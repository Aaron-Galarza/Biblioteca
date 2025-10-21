// C:\Users\Usuario\Desktop\Aaron\PRACTICAS\BibliotecaApp\backend\functions\src\routes\importRoutes.js

import { Router } from "express";
import { loadInitialData } from "../controllers/importController.js";

const router = Router();

// Ruta para ejecutar la carga de datos iniciales (solo en desarrollo)
router.post("/load-data", loadInitialData);

export default router;