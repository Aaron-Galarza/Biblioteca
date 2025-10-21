// C:\Users\Usuario\Desktop\Aaron\PRACTICAS\BibliotecaApp\backend\src\config\firebase.js

import admin from "firebase-admin";
import { createRequire } from "module"; 
const require = createRequire(import.meta.url);

// Obtener la ruta a tu archivo JSON de credenciales
// NOTA: Para desarrollo local, usa el archivo JSON descargado.
// Para el despliegue en Firebase Functions, este paso no es necesario,
// Firebase se autentica automáticamente.

// Reemplaza 'ruta/a/tu/archivo.json' con la ruta real al JSON descargado en el Paso 1.E
const serviceAccount = require('./biblioteca-58b5c-firebase-adminsdk-fbsvc-edec7728d2.json'); 

if (!admin.apps.length) {
  // Inicialización de Firebase
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Puedes dejar esto vacío si solo usas Firestore
  });
}

// Exportar la instancia de Firestore para usarla en los servicios (DAO)
export const db = admin.firestore();

// 💡 Si estás usando la carpeta 'functions', la ruta al JSON debe ser relativa a donde se ejecuta el código. 
// Es mejor usar variables de entorno o la autenticación por defecto de Firebase Functions.