// ..backend/functions/index.js

import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import * as functions from "firebase-functions"; 

import booksRoutes from "./src/routes/books.routes.js";
import partnersRoutes from "./src/routes/partners.routes.js"; // TODO: From partners to user?
import loansRoutes from "./src/routes/loans.routes.js";
import finesRoutes from "./src/routes/fines.routes.js";
import importRoutes from "./src/routes/import.routes.js"
import configRoutes from "./src/routes/config.routes.js"
import reportsRoutes from "./src/routes/reports.routes.js"
import authRoutes from "./src/routes/auth.routes.js";
import exportRoutes from "./src/routes/exports.routes.js"

const app = express();

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Principal Endpoints
app.use("/books", booksRoutes);
app.use("/partners", partnersRoutes);     // Socios
app.use("/loans", loansRoutes);           // Prestamos
app.use("/fines", finesRoutes);           // Multas
app.use("/config", configRoutes )
app.use("/reports", reportsRoutes)
app.use("/auth", authRoutes);             // Auth routes
app.use("/export", exportRoutes)

// Ruta temporal para la carga inicial de datos
app.use("/import", importRoutes); // NOTE: Use for dev only

// Error Handler - Express Middleware
app.use((err, req, res, next) => {
  console.error(" Error:", err.message);
  // Determine the status code based on the error message to provide a better REST response
  const statusCode = err.message.includes("no encontrado") || err.message.includes("existe") ? 404 : 500;
  res.status(statusCode).json({ error: err.message });
});

// Export the Express application as a single HTTP function for Firebase
export const api = functions.https.onRequest(app);