// C:\Users\Usuario\Desktop\Aaron\PRACTICAS\BibliotecaApp\backend\src\services\socioService.js

import { db } from "../config/firebase.js";
import Joi from "joi"

const sociosCollection = db.collection("socios");

// Convierte un documento de Firestore a un objeto con el ID de Socio (idSocio)
const mapSocio = (doc) => ({ idSocio: doc.id, ...doc.data() });

const schema = Joi.object().keys({
  dni: Joi.string().min(9).max(9),
  nombre: Joi.string(),
  email: Joi.email(),
  telefono: Joi.string()
}).required()

// Crear socio (con generación automática de número de socio)
export const registrarSocio = async (datos) => {
  
  try {

    const { dni, nombre, email, telefono } = datos;

    schema.validate(datos); // TODO: Test if works pls
    
    // if (!dni || !nombre) throw new Error("Datos incompletos");

    // Verificar si ya existe un socio con el mismo DNI
    const existeQuery = await sociosCollection.where("dni", "==", dni).limit(1).get(); // TODO: With phone also i guess
    if (!existeQuery.empty) throw new Error("El socio ya está registrado");

    // Generar el numeroSocio (simulando el hook beforeCreate de Sequelize)
    // Usamos una transacción para asegurar que la generación del número sea atómica
    let nuevoSocioData = {};

    await db.runTransaction(async (t) => {
      // 1. Obtener el último numeroSocio
      const ultimoSocioQuery = await sociosCollection.orderBy("numeroSocio", "desc").limit(1).get();
      let nuevoNumero = 1;

      if (!ultimoSocioQuery.empty) {
        const ultimoNumeroStr = ultimoSocioQuery.docs[0].data().numeroSocio;
        nuevoNumero = parseInt(ultimoNumeroStr) + 1;
      }

      const numeroSocio = nuevoNumero.toString().padStart(4, "0");

      // 2. Crear socio
      const nuevoSocioRef = sociosCollection.doc(); // Firestore genera el ID
      t.set(nuevoSocioRef, { 
          dni, 
          nombre, 
          email, 
          telefono, 
          numeroSocio 
      });

      // 3. Preparar la data para retornar
      nuevoSocioData = { idSocio: nuevoSocioRef.id, dni, nombre, email, telefono, numeroSocio };
    });
    
    return nuevoSocioData;
  } catch (error) {
    throw error;
  }
};

// Listar socios
export const obtenerSocios = async () => {
  const snapshot = await sociosCollection.orderBy("nombre").get();
  return snapshot.docs.map(mapSocio);
};

// Obtener socio por ID
export const obtenerSocioPorId = async (id) => {
  const socioDoc = await sociosCollection.doc(id).get();
  if (!socioDoc.exists) throw new Error("Socio no encontrado");
  return mapSocio(socioDoc);
};

// Actualizar socio
export const actualizarSocio = async (id, datos) => {
  const socioDoc = sociosCollection.doc(id);
  const docSnapshot = await socioDoc.get();
  if (!docSnapshot.exists) throw new Error("Socio no encontrado");

  await socioDoc.update(datos);
  const socioActualizado = await socioDoc.get();
  return mapSocio(socioActualizado);
};

// Eliminar socio
export const eliminarSocio = async (id) => {
  const socioDoc = sociosCollection.doc(id);
  const docSnapshot = await socioDoc.get();
  if (!docSnapshot.exists) throw new Error("Socio no encontrado");
  await socioDoc.delete();
};