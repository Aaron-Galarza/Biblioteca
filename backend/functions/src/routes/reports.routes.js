import { Router } from "express"
import {
    LibrosPopulares,
    SociosActivos,
    alertasVencidas
} from "../controllers/reports.controller.js"

const router = Router()

router.get("/popular-books", LibrosPopulares)
router.get("/active-members", SociosActivos)
router.get("/vencidos", alertasVencidas)

export default router