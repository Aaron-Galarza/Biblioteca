// ..backend/src/services/auth.service.js

import { db } from "../config/firebase.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
export const register = async ({ email, password, name }) => {
  const userRef = db.collection("users").doc(email);
  const doc = await userRef.get();
  if (doc.exists) { throw new Error("El usuario ya existe");}

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword, name };
  await userRef.set(newUser);
  return { email, name };
};

// Login user
export const login = async ({ email, password }) => {
  const userRef = db.collection("users").doc(email);
  const doc = await userRef.get();
  if (!doc.exists) { throw new Error("Usuario no encontrado"); }

  const userData = doc.data();
  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!isPasswordValid) { throw new Error("Contraseña incorrecta"); }

  const token = jwt.sign({ email: userData.email, name: userData.name }, { expiresIn: "1h" });

  // TODO: pls test this if possible 🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏🙏
  
  return token;
};