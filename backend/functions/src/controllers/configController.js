import { db } from "../config/firebase.js";

export const getConfig = async (req, res) => {
    try {
        // La configuración se guarda como un único documento 'general' en la colección 'config'
        const configDoc = await db.collection("config").doc("general").get();
        
        if (!configDoc.exists) {
            //sino existe crea esta config por defecto
            return res.json({
                diasPrestamo: 7,
                montoMultaDiaria: 50,
                limiteLibros: 3,
                moneda: "ARS"
            });
        }
        //si existe devuelve los valores almacenados en la base de datos
        res.json(configDoc.data());
    } catch (error) {
        console.error("Error al obtener la configuración:", error);
        res.status(500).json({ error: "Error interno al acceder a la configuración." });
    }
};