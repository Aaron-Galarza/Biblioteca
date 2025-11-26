import { db } from "../config/firebase.config.js";

const prestamosCollection = db.collection("prestamos");
const librosCollection = db.collection("libros");
const sociosCollection = db.collection("socios");

export const getPopulares = async () => {
    const snapshot = await librosCollection
        .orderBy("popularidad", "desc")
        .limit(10)
        .get()

    return snapshot.docs.map(doc => ({idLibro: doc.id, ...doc.data()}))
}

export const getSociosAtivos = async () => {
    const snapshot = await sociosCollection
        .orderBy("totalPrestamos", "desc")
        .limit(10)
        .get()

    return snapshot.docs.map(doc => ({idSocio: doc.id, ...doc.data()}))
}

export const getPrestamosVencidos = async () => {
    
    // btener todos los préstamos activos
    const snapshot = await prestamosCollection
        .where("estadoPrestamo", "==", "ACTIVO") 
        .get();
        
    const prestamosActivos = snapshot.docs.map(doc => ({idPrestamo: doc.id, ...doc.data() }));
    
    // filtramos los que están vencidos (fechaDevolucion < hoy)
    const hoy = new Date();
    
    const vencidos = prestamosActivos.filter(p => {
        const fechaVencimiento = new Date(p.fechaDevolucion);
        return fechaVencimiento < hoy;
    });

    // hacemos el reporte con datos de Socio y Libro
    const vencidosEnriquecidos = await Promise.all(vencidos.map(async (prestamo) => {
        
        const socioDoc = await sociosCollection.doc(prestamo.idSocio).get();
        const libroDoc = await librosCollection.doc(prestamo.idLibro).get();
        
        const fechaDevolucion = new Date(prestamo.fechaDevolucion);
        
        // calcular días de mora
        const diferenciaMilisegundos = hoy.getTime() - fechaDevolucion.getTime();
        const diasMora = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

        return {
            idPrestamo: prestamo.idPrestamo,
            fechaDevolucion: prestamo.fechaDevolucion,
            diasMora: diasMora,
            socio: {
                idSocio: prestamo.idSocio,
                nombre: socioDoc.exists ? socioDoc.data().nombre : "Socio Desconocido"
            },
            libro: {
                idLibro: prestamo.idLibro,
                titulo: libroDoc.exists ? libroDoc.data().titulo : "Libro Desconocido"
            }
        };
    }));

    return vencidosEnriquecidos;
};