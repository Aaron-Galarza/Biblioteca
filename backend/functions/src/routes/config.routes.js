import { Router } from "express"
import { 
    getConfig
} from "../controllers/config.controller.js"

const router = Router()

router.get('/', getConfig)

export default router