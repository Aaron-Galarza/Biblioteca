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
    const token = await authService.login(req.body);
    res.json({ msg: "Login exitoso", token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const profile = async (req, res) => {
  res.json(req.user);
};
