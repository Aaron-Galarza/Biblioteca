// C:\Users\Usuario\Desktop\Aaron\PRACTICAS\BibliotecaApp\backend\src\config\firebase.js

import admin from "firebase-admin";
import { createRequire } from "module"; 
const require = createRequire(import.meta.url);

if (!admin.apps.length) {
  // Inicialización de Firebase
  admin.initializeApp({
  });
}

// Exportar la instancia de Firestore para usarla en los servicios (DAO)
export const db = admin.firestore();

// 💡 Si estás usando la carpeta 'functions', la ruta al JSON debe ser relativa a donde se ejecuta el código. 
// Es mejor usar variables de entorno o la autenticación por defecto de Firebase Functions.