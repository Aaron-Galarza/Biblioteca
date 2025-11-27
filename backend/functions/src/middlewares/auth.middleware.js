// ..backend/src/middleware/auth.middleware.js

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ error: "Acceso denegado. Se requiere un token." });
  }

  const token = authHeader.split(' ')[1]; // Formato "Bearer <token>"
  if (!token) {
    return res.status(403).json({ error: "Formato de token inválido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "No autorizado: El token es inválido o ha expirado." });
    }
    req.user = decoded;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ error: "Acceso denegado: Se requiere rol de Administrador." });
  }
};

export const isUser = (req, res, next) => {
    if (req.user && (req.user.role === 'USER' || req.user.role === 'ADMIN')) {
        next();
    } else {
        return res.status(403).json({ error: "Acceso denegado: Se requiere iniciar sesión." });
    }
};

export const authRequired = (req, res, next) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    console.error("Error verificando JWT:", error.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};