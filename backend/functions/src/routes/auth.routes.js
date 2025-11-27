// src/routes/auth.routes.js
import express from "express";
import { register, login, profile } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// LEE JWT DESDE COOKIE
router.get("/profile", authRequired, profile);


export default router;
