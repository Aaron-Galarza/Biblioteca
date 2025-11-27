// src/routes/auth.routes.js
import express from "express";
import { register, login, profile } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// LEE JWT DESDE COOKIE
router.get("/profile", authRequired, profile);

// Logout borrando cookie
router.post("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  res.json({ msg: "Logout exitoso" });
});

export default router;
