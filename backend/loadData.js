// backend/loadData.js
import admin from 'firebase-admin';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// JSON de credentials of service
const serviceAccount = require('./functions/src/config/biblioteca-58b5c-firebase-adminsdk-fbsvc-edec7728d2.json'); 
const data = require('./data_import.json'); // TODO: data_import.json on root

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Start Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const loadData = async () => {
    console.log("Iniciando carga de datos en Firestore...");
    try {
        // Load Partners
        const sociosCollection = db.collection('socios');
        for (const key in data.socios) {
            await sociosCollection.doc(key).set(data.socios[key]);
            console.log(`Socio ${key} cargado.`);
        }

        // Load Books
        const librosCollection = db.collection('libros');
        for (const key in data.libros) {
            await librosCollection.doc(key).set(data.libros[key]);
            console.log(`Libro ${key} cargado.`);
        }
        
        // Load Loans
        const prestamosCollection = db.collection('prestamos');
        for (const key in data.prestamos) {
            await prestamosCollection.doc(key).set(data.prestamos[key]);
            console.log(`Préstamo ${key} cargado.`);
        }
        
        // Load Fines
        const multasCollection = db.collection('multas');
        for (const key in data.multas) {
            await multasCollection.doc(key).set(data.multas[key]);
            console.log(`Multa ${key} cargada.`);
        }

        console.log("¡Carga de datos iniciales completa! 🎉"); // TODO: Remove console.log if possible
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        process.exit(1);
    }
};

loadData().then(() => process.exit(0));