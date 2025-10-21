// C:\Users\Usuario\Desktop\Aaron\PRACTICAS\BibliotecaApp\backend\functions\index.js

import express from "express";
import cors from "cors";
// Importa las funciones de firebase
import * as functions from "firebase-functions"; 


import libroRoutes from "./src/routes/libroRoutes.js";  // ✅ ANTES: ../src/...
import socioRoutes from "./src/routes/socioRoutes.js";  // ✅
import prestamoRoutes from "./src/routes/prestamoRoutes.js"; // ✅
import multaRoutes from "./src/routes/multaRoutes.js"; // ✅
import importRoutes from "./src/routes/importRoutes.js"

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Endpoints principales
app.use("/api/libros", libroRoutes);
app.use("/api/socios", socioRoutes);
app.use("/api/prestamos", prestamoRoutes);
app.use("/api/multas", multaRoutes);

// Ruta temporal para la carga inicial de datos
app.use("/api/import", importRoutes); 

// Manejo de errores (Middleware de Express)
app.use((err, req, res, next) => {
  console.error(" Error:", err.message);
  // Determina el código de estado basado en el mensaje de error para dar una mejor respuesta REST
  const statusCode = err.message.includes("no encontrado") || err.message.includes("existe") ? 404 : 500;
  res.status(statusCode).json({ error: err.message });
});


// 🚀 Exportamos la aplicación Express como una sola función HTTP para Firebase
export const api = functions.https.onRequest(app);