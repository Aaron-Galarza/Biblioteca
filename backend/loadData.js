// backend/loadData.js
import admin from 'firebase-admin';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// 🚨 Reemplaza con la ruta real a tu archivo JSON de credenciales de servicio
const serviceAccount = require('./functions/src/config/biblioteca-58b5c-firebase-adminsdk-fbsvc-edec7728d2.json'); 
const data = require('./data_import.json'); // Asegúrate de que data_import.json esté aquí

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Inicializa Firebase Admin SDK (para cargar datos)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();



const loadData = async () => {
    console.log("Iniciando carga de datos en Firestore...");
    try {
        // Carga de Socios
        const sociosCollection = db.collection('socios');
        for (const key in data.socios) {
            await sociosCollection.doc(key).set(data.socios[key]);
            console.log(`Socio ${key} cargado.`);
        }

        // Carga de Libros
        const librosCollection = db.collection('libros');
        for (const key in data.libros) {
            await librosCollection.doc(key).set(data.libros[key]);
            console.log(`Libro ${key} cargado.`);
        }
        
        // Carga de Préstamos
        const prestamosCollection = db.collection('prestamos');
        for (const key in data.prestamos) {
            await prestamosCollection.doc(key).set(data.prestamos[key]);
            console.log(`Préstamo ${key} cargado.`);
        }
        
        // Carga de Multas
        const multasCollection = db.collection('multas');
        for (const key in data.multas) {
            await multasCollection.doc(key).set(data.multas[key]);
            console.log(`Multa ${key} cargada.`);
        }

        console.log("¡Carga de datos iniciales completa! 🎉");
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        process.exit(1);
    }
};

loadData().then(() => process.exit(0));

// NOTA: Para ejecutar este script, asegúrate de tener "type": "module" en tu package.json principal