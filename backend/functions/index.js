// ..backend/functions/index.js

import express from "express";
import cors from "cors";
import * as functions from "firebase-functions"; 

import libroRoutes from "./src/routes/libroRoutes.js";
import socioRoutes from "./src/routes/socioRoutes.js"; // TODO: From socio to user?
import prestamoRoutes from "./src/routes/prestamoRoutes.js";
import multaRoutes from "./src/routes/multaRoutes.js";
import importRoutes from "./src/routes/importRoutes.js"
import configRoutes from "./src/routes/configRouters.js"

const app = express();

app.use(cors({ origin: true })); // TODO: Add METHODS & origin: "*"
app.use(express.json());

// Principal Endpoints
app.use("/libros", libroRoutes); // TODO: Translate endpoint to english?
app.use("/socios", socioRoutes);
app.use("/prestamos", prestamoRoutes);
app.use("/multas", multaRoutes);
app.use("/config", configRoutes )

// Ruta temporal para la carga inicial de datos
app.use("/import", importRoutes); // TODO: Remove? Use for dev only?

// Error Handler - Express Middleware
app.use((err, req, res, next) => {
  console.error(" Error:", err.message);
  // Determine the status code based on the error message to provide a better REST response
  const statusCode = err.message.includes("no encontrado") || err.message.includes("existe") ? 404 : 500;
  res.status(statusCode).json({ error: err.message });
});


// Export the Express application as a single HTTP function for Firebase
export const api = functions.https.onRequest(app);