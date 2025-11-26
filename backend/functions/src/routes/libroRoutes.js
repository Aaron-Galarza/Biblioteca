import express from "express";
import {
    getLibros,
    getLibroById,
    crearLibro,
    actualizarLibro,
    eliminarLibro,
    reservarLibro
} from "../controllers/libroController.js";

const router = express.Router();

router.get("/", getLibros);
router.get("/:id", getLibroById);
router.post("/", crearLibro);
router.put("/:id", actualizarLibro);
router.delete("/:id", eliminarLibro);
router.post("/:id/reserva", reservarLibro)

export default router;