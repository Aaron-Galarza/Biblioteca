import { Router } from "express"
import {
    LibrosPopulares,
    SociosActivos,
    alertasVencidas
} from "../controllers/reportesController.js"

const router = Router()

router.get("/popular-books", LibrosPopulares)
router.get("/active-members", SociosActivos)
router.get("/vencidos", alertasVencidas)

export default router