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

import { verifyToken, isAdmin, isUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// TODO: improve routes for one/many methods if possible. Maybe dynamic routing

router.get("/", getSocios);
router.get("/:id", getSocioById);

router.post("/", verifyToken, isAdmin, crearSocio);                                           // Protected route (Admin)
router.put("/:id", verifyToken, isAdmin, actualizarSocio);                                    // Protected route (Admin)  
router.delete("/:id", verifyToken, isAdmin, eliminarSocio);                                   // Protected route (Admin)

router.get("/:id/loan", verifyToken, isUser, obtenerPrestamosSocio)                           // Protected route (User)
router.get("/:id/fines", verifyToken, isUser, obtenerMultasSocio)                             // Protected route (User)
router.get("/:id/notifications", verifyToken, isUser, obtenerNotificacionesSocio)             // Protected route (User)

export default router;