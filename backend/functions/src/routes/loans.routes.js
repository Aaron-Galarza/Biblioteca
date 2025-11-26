import express from "express";
import {
    obtenerPrestamos,
    crearPrestamo,
    devolverLibro,
    extenderLoan
} from "../controllers/loans.controller.js";

import { verifyToken, isAdmin, isUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", obtenerPrestamos);

router.post("/", verifyToken, isAdmin, crearPrestamo);                    // Protected route (Admin)

router.put("/:idLoan/return", verifyToken, isUser, devolverLibro);        // Protected route (User)
router.post("/:idLoan/extend", verifyToken, isUser, extenderLoan);        // Protected route (User)

export default router;