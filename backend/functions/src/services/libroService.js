// C:\Users\Usuario\Desktop\Aaron\PRACTICAS\BibliotecaApp\backend\src\services\libroService.js

import { db } from "../config/firebase.js";

const librosCollection = db.collection("libros");

// Convierte un documento de Firestore a un objeto con el ID de Libro (idLibro)
const mapLibro = (doc) => ({ idLibro: doc.id, ...doc.data() });

// Crear libro
export const crearLibro = async (data) => {
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

// Listar todos los libros
export const obtenerLibros = async () => {
  const snapshot = await librosCollection.orderBy("titulo").get();
  return snapshot.docs.map(mapLibro);
};

// Obtener libro por ID
export const obtenerLibroPorId = async (id) => {
  const libroDoc = await librosCollection.doc(id).get();
  if (!libroDoc.exists) throw new Error("Libro no encontrado");
  return mapLibro(libroDoc);
};

// Actualizar libro
export const actualizarLibro = async (id, datos) => {
  const libroRef = librosCollection.doc(id);
  const docSnapshot = await libroRef.get();
  if (!docSnapshot.exists) throw new Error("Libro no encontrado");
  
  await libroRef.update(datos);
  const libroActualizado = await libroRef.get();
  return mapLibro(libroActualizado);
};

// Eliminar libro
export const eliminarLibro = async (id) => {
  const libroRef = librosCollection.doc(id);
  const docSnapshot = await libroRef.get();
  if (!docSnapshot.exists) throw new Error("Libro no encontrado");
  await libroRef.delete();
};

// El resto de las funciones (prestarLibro, devolverLibro, etc.) se manejarán en prestamoService para la lógica transaccional.