import express from "express";
import { 
    getSocios,
    getSocioById,
    crearSocio,
    actualizarSocio,
    eliminarSocio,
    obtenerPrestamosSocio,
    obtenerMultasSocio,
    obtenerNotificacionesSocio
} from "../controllers/partners.controller.js";

const router = express.Router();

// TODO: improve routes for one/many methods if possible. Maybe dynamic routing

router.get("/", getSocios);
router.get("/:id", getSocioById);
router.post("/", crearSocio);
router.put("/:id", actualizarSocio);
router.delete("/:id", eliminarSocio);
router.get("/:id/prestamos", obtenerPrestamosSocio)
router.get("/:id/multas", obtenerMultasSocio)
router.get("/:id/notificaciones", obtenerNotificacionesSocio)

export default router;