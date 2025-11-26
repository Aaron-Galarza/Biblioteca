// ..backend/src/services/auth.service.js

import { db } from "../config/firebase.config.js";
import bcrypt from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";

const registerSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': `"nombre" debe ser un tipo de 'texto'`,
    'string.empty': `"nombre" no puede estar vacío`,
    'string.min': `"nombre" debe tener una longitud mínima de {#limit}`,
    'any.required': `"nombre" es un campo obligatorio`
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': `"email" debe ser un correo electrónico válido`,
    'any.required': `"email" es un campo obligatorio`
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': `"contraseña" debe tener una longitud mínima de {#limit}`,
    'any.required': `"contraseña" es un campo obligatorio`
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': `"email" debe ser un correo electrónico válido`,
    'any.required': `"email" es un campo obligatorio`
  }),
  password: Joi.string().required().messages({
    'string.empty': `"contraseña" no puede estar vacía`,
    'any.required': `"contraseña" es un campo obligatorio`
  })
});

// Register a new user
export const register = async (data) => {

  const { error } = registerSchema.validate(data);
  if (error) { throw new Error(error.details[0].message); }
  const { email, password, name } = data;

  const userRef = db.collection("users").doc(email);
  const doc = await userRef.get();
  if (doc.exists) { throw new Error("El usuario ya existe");}

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword, name };
  await userRef.set(newUser);
  return { email, name };
};

// Login user
export const login = async (data) => {

  const { error } = loginSchema.validate(data);
  if (error) { throw new Error(error.details[0].message); }
  const { email, password } = data;

  const userRef = db.collection("users").doc(email);
  const doc = await userRef.get();
  if (!doc.exists) { throw new Error("Usuario no encontrado"); }

  const userData = doc.data();
  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!isPasswordValid) { throw new Error("Contraseña incorrecta"); }

  const token = jwt.sign({ email: userData.email, name: userData.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
  return token;
};