// src/controllers/auth.controller.js
import * as authService from "../services/auth.service.js";

// POST Register
export const register = async (req, res) => {
  try {
    const nuevoUsuario = await authService.register(req.body);
    res.status(201).json({ msg: "Usuario registrado correctamente", nuevoUsuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST Login
export const login = async (req, res) => {
  try {
    // El servicio devuelve { token, user }
    const { token, user } = await authService.login(req.body);

    // *** SETEAR COOKIE HTTPONLY ***
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    });

    res.json({
      msg: "Login exitoso",
      user,
    });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// GET Profile
export const profile = async (req, res) => {
  res.json(req.user);
};
