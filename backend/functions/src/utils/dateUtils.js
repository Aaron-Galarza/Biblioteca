//funcion para disminuir la carga logica de backend\functions\src\services\loans.service.js
export const calcularNuevaFechaVencimiento = (fechaActual, dias) => {
    const nuevaFecha = new Date(fechaActual.getTime());
    nuevaFecha.setDate(fechaActual.getDate() + dias);
    return nuevaFecha;
};

//conversor de fechas (String/Timestamp a Date)
export const toJSDate = (fechaValue) => {
    if (!fechaValue) {
        throw new Error("El valor de fecha es nulo o indefinido.");
    }
    
    // Caso 1: Es un objeto Timestamp de Firestore
    if (typeof fechaValue.toDate === 'function') {
        return fechaValue.toDate();
    } 
    
    // Caso 2: Es una cadena de texto
    if (typeof fechaValue === 'string') {
        const date = new Date(fechaValue);
        
        // Verificación básica para asegurar que la cadena fue parseada correctamente
        if (isNaN(date.getTime())) {
            throw new Error(`Cadena de fecha inválida: ${fechaValue}`);
        }
        return date;
    }
    
    // Caso 3: Ya es un objeto Date
    if (fechaValue instanceof Date) {
        return fechaValue;
    }

    // Caso por defecto (dato corrupto)
    throw new Error(`Tipo de dato de fecha no soportado: ${typeof fechaValue}`);
};