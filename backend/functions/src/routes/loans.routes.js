import express from "express";
import { obtenerPrestamos, crearPrestamo, devolverLibro, extenderLoan } from "../controllers/loans.controller.js";

const router = express.Router();

router.get("/", obtenerPrestamos);
router.post("/", crearPrestamo);
router.put("/:idPrestamo/devolver", devolverLibro);
router.post("/:idPrestamo/extender", extenderLoan);

export default router;