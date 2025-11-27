import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
