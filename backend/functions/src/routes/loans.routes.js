import express from "express";
import { obtenerPrestamos, crearPrestamo, devolverLibro } from "../controllers/loans.controller.js";

const router = express.Router();

router.get("/", obtenerPrestamos);
router.post("/", crearPrestamo);
router.put("/:idPrestamo/devolver", devolverLibro);

export default router;