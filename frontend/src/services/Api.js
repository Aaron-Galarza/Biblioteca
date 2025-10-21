// C:\Users\Usuario\Desktop\Aaron\PRACTICAS\BibliotecaApp\frontend\src\services\Api.js

import axios from "axios";

// 🚨 CORRECCIÓN CRÍTICA: La URL base de tu backend desplegado
const API_BASE_URL = "https://api-ycx65nj75a-uc.a.run.app/api/";

// Configuración base del backend
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;