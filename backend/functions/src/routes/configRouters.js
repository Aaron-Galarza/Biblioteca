import { Router } from "express"
import { 
    getConfig
} from "../controllers/configController.js"

const router = Router()

router.get('/', getConfig)

export default router