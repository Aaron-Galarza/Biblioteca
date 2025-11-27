import express from "express";
import { register, login, profile } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authRequired, profile);

export default router;