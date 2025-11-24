// ..backend/src/services/prestamoService.js

import { db } from "../config/firebase.js";

const prestamosCollection = db.collection("prestamos");
const librosCollection = db.collection("libros");
const sociosCollection = db.collection("socios");

// Convierte un documento de Firestore a un objeto con el ID de Préstamo (idPrestamo)
const mapPrestamo = (doc) => ({ idPrestamo: doc.id, ...doc.data() });

// Función para simular el JOIN de NoSQL
const fetchRelatedData = async (prestamos) => {
    return Promise.all(prestamos.map(async (prestamo) => {
        // Fetch Socio
        const socioDoc = await sociosCollection.doc(prestamo.idSocio).get();
        if (socioDoc.exists) {
            prestamo.Socio = { idSocio: socioDoc.id, nombre: socioDoc.data().nombre, numeroSocio: socioDoc.data().numeroSocio };
        }
        
        // Fetch Libro
        const libroDoc = await librosCollection.doc(prestamo.idLibro).get();
        if (libroDoc.exists) {
            prestamo.Libro = { idLibro: libroDoc.id, titulo: libroDoc.data().titulo, estado: libroDoc.data().estado };
        }
        return prestamo;
    }));
};


// Obtener préstamos activos
export const obtenerPrestamos = async () => {
  const snapshot = await prestamosCollection
    .where("estadoPrestamo", "==", "ACTIVO")
    .get();
    
  let prestamos = snapshot.docs.map(mapPrestamo);
  return fetchRelatedData(prestamos);
};

// Crear préstamo (Usando Transacciones para la atomicidad Libro/Prestamo)
export const crearPrestamo = async ({ idLibro, idSocio, fechaInicio, fechaDevolucion }) => {
  let prestamoData = {};

  // Usamos una transacción para asegurar que el estado del libro y el registro del préstamo 
  // se actualicen o fallen juntos.
  await db.runTransaction(async (t) => {
    const libroRef = librosCollection.doc(idLibro);
    const socioRef = sociosCollection.doc(idSocio);

    const [libroDoc, socioDoc] = await t.getAll(libroRef, socioRef);

    if (!libroDoc.exists) throw new Error("Libro no encontrado");
    if (!socioDoc.exists) throw new Error("Socio no encontrado");
    
    const libroData = libroDoc.data();
    if (libroData.estado === "PRESTADO") throw new Error("El libro no está disponible");

    // 1. Cambiar estado del Libro (dentro de la transacción)
    t.update(libroRef, { estado: "PRESTADO" });

    // 2. Crear el Préstamo (dentro de la transacción)
    const nuevoPrestamoRef = prestamosCollection.doc();
    prestamoData = {
        idLibro, 
        idSocio, 
        fechaInicio, 
        fechaDevolucion, 
        estadoPrestamo: "ACTIVO",
        multa: 0 // Campo por defecto
    };
    t.set(nuevoPrestamoRef, prestamoData);
    
    // Asignar el ID de Firestore al objeto de retorno
    prestamoData.idPrestamo = nuevoPrestamoRef.id; 
  });

  // Retornamos el objeto si la transacción fue exitosa
  return prestamoData;
};

// Registrar devolución
export const cerrarPrestamo = async (idPrestamo) => {
  let resultado = { msg: "Libro devuelto correctamente" };

  await db.runTransaction(async (t) => {
    const prestamoRef = prestamosCollection.doc(idPrestamo);
    const prestamoDoc = await t.get(prestamoRef);

    if (!prestamoDoc.exists) throw new Error("Préstamo no encontrado");
    
    const prestamoData = prestamoDoc.data();
    const libroRef = librosCollection.doc(prestamoData.idLibro);

    // 1. Actualizar estado del Préstamo a CERRADO
    t.update(prestamoRef, {
      estadoPrestamo: "CERRADO",
      fechaRealDevolucion: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
    });

    // 2. Actualizar estado del Libro a DISPONIBLE
    t.update(libroRef, { estado: "DISPONIBLE" });
  });

  return resultado;
};