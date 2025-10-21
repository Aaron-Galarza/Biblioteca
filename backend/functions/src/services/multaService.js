// C:\Users\Usuario\Desktop\Aaron\PRACTICAS\BibliotecaApp\backend\src\services\multaService.js

import { db } from "../config/firebase.js";

const multasCollection = db.collection("multas");
const sociosCollection = db.collection("socios"); // Necesario para la relación

// Convierte un documento de Firestore a un objeto con el ID de Multa (idMulta)
const mapMulta = (doc) => ({ idMulta: doc.id, ...doc.data() });

export const obtenerMultas = async () => {
  // Obtener multas activas
  const snapshot = await multasCollection
    .where("estado", "==", "ACTIVA") 
    .orderBy("fecha", "desc")
    .get();

  let multas = snapshot.docs.map(mapMulta);

  // 🔄 Simulación de JOIN para obtener datos del Socio
  // Esto es necesario en NoSQL, ya que no hay JOINs automáticos
  const multasConSocio = await Promise.all(multas.map(async (multa) => {
    if (multa.idSocio) {
      const socioDoc = await sociosCollection.doc(multa.idSocio).get();
      if (socioDoc.exists) {
        multa.Socio = {
          idSocio: socioDoc.id, 
          nombre: socioDoc.data().nombre, 
          numeroSocio: socioDoc.data().numeroSocio 
        };
      }
    }
    return multa;
  }));

  return multasConSocio;
};

export const crearMulta = async ({ idSocio, motivo, monto, fecha }) => {
  if (!idSocio || !motivo || !monto || !fecha) {
    throw new Error("Datos incompletos para registrar la multa");
  }

  // Verificar si el socio existe antes de crear la multa (opcional pero recomendado)
  const socioDoc = await sociosCollection.doc(idSocio).get();
  if (!socioDoc.exists) throw new Error("Socio no encontrado para registrar la multa");
  
  const multaRef = await multasCollection.add({
    idSocio,
    motivo,
    monto: parseFloat(monto),
    fecha,
    estado: "ACTIVA",
  });
  
  const multa = await multaRef.get();
  return mapMulta(multa);
};

export const cancelarMulta = async (idMulta) => {
  const multaRef = multasCollection.doc(idMulta);
  const multaDoc = await multaRef.get();
  if (!multaDoc.exists) throw new Error("Multa no encontrada");

  await multaRef.update({ estado: "PAGADA" }); 

  return { msg: "Multa cancelada correctamente" };
};