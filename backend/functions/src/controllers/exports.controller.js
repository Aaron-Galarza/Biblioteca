import axios from 'axios';

// URL del Django en Cloud Run
const DJANGO_REPORTS_URL = "https://django-reports-api-915017453479.us-central1.run.app/export/";

export const exportDatabaseToCSV = async (req, res) => {
    try {
        console.log("Solicitando exportación completa de la base de datos...");
        
        //Llamar a Django para obtener el ZIP
        const djangoResponse = await axios.get(DJANGO_REPORTS_URL, {
            responseType: 'stream'  //importante para archivos grandes
        });

        //configurar headers para descarga directa
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="backup_biblioteca_completo.zip"');
        res.setHeader('X-Export-Success', 'true');
        
        djangoResponse.data.pipe(res);
        
        console.log("Exportación completada exitosamente");

    } catch (error) {
        console.error("Error en la exportación:", error.message);
        
        let errorMessage = "No se pudo generar el backup. Intente nuevamente.";
        
        if (error.response && error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
        }

        res.status(500).json({ 
            success: false, 
            error: errorMessage,
            detail: "El servicio de exportación no está disponible"
        });
    }
};