// C:\Users\Usuario\Desktop\Aaron\PRACTICAS\BibliotecaApp\backend\src\services\libroService.js

import { db } from "../config/firebase.config.js";

const librosCollection = db.collection("libros");

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
