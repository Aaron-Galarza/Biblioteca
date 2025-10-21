// C:\Users\Usuario\Desktop\Aaron\PRACTICAS\BibliotecaApp\backend\functions\src\controllers\importController.js

import { db } from "../config/firebase.js";
import { createRequire } from "module";

// Necesitamos 'require' para cargar el JSON plano, que es la forma más fácil.
const require = createRequire(import.meta.url);

// 🚨 La ruta debe ser relativa a donde se ejecuta el código (la carpeta 'functions')
// Asegúrate que tu archivo data_import.json esté en la carpeta functions/
const data = require('../../data_import.json'); 

export const loadInitialData = async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: "Prohibido cargar datos iniciales en producción" });
    }
    
    console.log("Iniciando carga de datos en Firestore del EMULADOR...");
    
    try {
        const batch = db.batch(); // Usamos un batch para cargas rápidas

        // Iterar sobre cada colección en data_import.json
        for (const collectionName in data) {
            const collectionData = data[collectionName];
            const collectionRef = db.collection(collectionName);
            
            // Iterar sobre cada documento en la colección
            for (const docId in collectionData) {
                const docData = collectionData[docId];
                // Usamos .doc(docId) para mantener los IDs definidos en el JSON
                const docRef = collectionRef.doc(docId);
                batch.set(docRef, docData);
            }
        }

        // Ejecutar el batch
        await batch.commit();
        
        console.log("¡Carga de datos en el emulador completa!");
        res.status(200).json({ message: "Datos iniciales cargados con éxito en el emulador." });

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        res.status(500).json({ error: "Error al ejecutar la carga: " + error.message });
    }
};