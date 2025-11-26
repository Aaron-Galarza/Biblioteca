// C:\Users\Usuario\Desktop\Aaron\PRACTICAS\BibliotecaApp\backend\src\services\libroService.js

import { db } from "../config/firebase.js";
import { FieldValue } from "firebase-admin/firestore";

const librosCollection = db.collection("libros");
const sociosCollection = db.collection("socios");
const reservasCollection = db.collection("reservas");
const prestamosCollection = db.collection("prestamos");

// Convierte un documento de Firestore a un objeto con el ID de Libro (idLibro)
const mapLibro = (doc) => ({ idLibro: doc.id, ...doc.data() });

// Create Book
export const createBook = async (data) => {
  const { titulo, autor, isbn } = data;
  if (!titulo || !autor || !isbn) throw new Error("Datos incompletos");

  const existente = await librosCollection.where("isbn", "==", isbn).limit(1).get();
  if (!existente.empty) throw new Error("Ya existe un libro con ese ISBN");

  const nuevoLibroRef = await librosCollection.add({
    titulo,
    autor,
    isbn,
    estado: "DISPONIBLE"
  });
  
  const nuevoLibro = await nuevoLibroRef.get();
  return mapLibro(nuevoLibro);
};

export const getBooks = async (filtros) => {

  // We get ordered list of books
  const snapshot = await librosCollection.orderBy("titulo", "asc").get();

  let books = snapshot.docs.map(mapLibro);

  //se filtra por titulo
  if (filtros.titulo) {
    books = books.filter(libro => libro.titulo.toLowerCase().includes(filtros.titulo.toLowerCase()));
  }

  //se filtra por autor
  if (filtros.autor) {
    books = books.filter(libro => libro.autor.toLowerCase().includes(filtros.autor.toLowerCase()));
  }

  if (filtros.estado) {
    books = books.filter(libro => libro.estado.toLowerCase().includes(filtros.estado.toLowerCase()) )
  }
  
  //se devuelve lo filtrado, si no se llego a filtrar nada devuelve toda la coleccion
  return books;
};

// Obtain Book by ID
export const getBookById = async (id) => {
  const libroDoc = await librosCollection.doc(id).get();
  if (!libroDoc.exists) throw new Error("Libro no encontrado");
  return mapLibro(libroDoc);
};

// Update Book
export const updateBook = async (id, datos) => {
  const libroRef = librosCollection.doc(id);
  const docSnapshot = await libroRef.get();
  if (!docSnapshot.exists) throw new Error("Libro no encontrado");
  
  await libroRef.update(datos);
  const libroActualizado = await libroRef.get();
  return mapLibro(libroActualizado);
};

// Delete Book
export const deleteBook = async (id) => {
  const libroRef = librosCollection.doc(id);
  const docSnapshot = await libroRef.get();
  if (!docSnapshot.exists) throw new Error("Libro no encontrado");
  await libroRef.delete();
};

export const postReserva = async ({idLibro, idSocio}) => {    
    // --- FASE 1: LECTURAS DE VALIDACIÓN RÁPIDAS (Optimizadas con Promise.all) ---

    // Leemos el libro, el socio, y buscamos si ya existe una reserva activa o un préstamo activo.
    const [
        libroDoc,
        socioDoc,
        existingReservationSnapshot,
        existingLoanSnapshot
    ] = await Promise.all([
        librosCollection.doc(idLibro).get(),
        sociosCollection.doc(idSocio).get(),
        reservasCollection.where('idLibro', '==', idLibro).where('idSocio', '==', idSocio).where('estadoReserva', '==', 'ACTIVA').limit(1).get(),
        prestamosCollection.where('idLibro', '==', idLibro).where('idSocio', '==', idSocio).where('estadoPrestamo', '==', 'ACTIVO').limit(1).get()
    ]);
    
    // --- FASE 2: VALIDACIONES DE REGLAS DE NEGOCIO ---
    
    if (!libroDoc.exists) throw new Error("Libro no encontrado.");
    if (!socioDoc.exists) throw new Error("Socio no encontrado.");

    if (existingReservationSnapshot.size > 0) {
        throw new Error("Ya tienes una reserva activa para este libro.");
    }
    if (existingLoanSnapshot.size > 0) {
        throw new Error("Ya tienes un préstamo activo de este libro.");
    }

    const libroData = libroDoc.data();
    if (libroData.estado === "DISPONIBLE") {
        throw new Error("El libro está disponible. ¡Puedes prestarlo directamente!");
    }

    const tituloLibro = libroData.titulo;
    const nombreSocio = socioDoc.data().nombre;
    
    // --- FASE 3: TRANSACCIÓN CRÍTICA (Escrituras Atómicas) ---

    let reservaData = {};

    await db.runTransaction(async (t) => {
        const libroRef = librosCollection.doc(idLibro);
        
        // 1. Crear la Reserva (registro histórico) y obtener el ID
        const nuevaReservaRef = reservasCollection.doc();
        const idReservaGenerado = nuevaReservaRef.id;

        reservaData = {
            idReserva: idReservaGenerado, // Incluimos el ID generado
            idLibro,
            tituloLibro,
            idSocio,
            nombreSocio,
            fechaReserva: FieldValue.serverTimestamp(),
            estadoReserva: "ACTIVA" 
        };
        
        t.set(nuevaReservaRef, reservaData); // Creamos el documento de reserva
        
        // 2. Actualizar el Libro: AÑADIR el ID de la RESERVA a la cola
        // El array 'colaReservas' ahora contendrá IDs opacos, lo que mejora la seguridad.
        t.update(libroRef, {
            colaReservas: FieldValue.arrayUnion(idReservaGenerado)
        });
    });

    // Devolvemos el objeto de la reserva, incluyendo el ID
    return reservaData;
};
