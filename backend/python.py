import functions_framework
import pandas as pd
from google.cloud import storage
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import os
import json

GCS_BUCKET = 'biblioteca-reportes-csv'

# Inicializa Firebase Admin SDK (busca credenciales automáticamente en Cloud Functions)
if not firebase_admin._apps:
    # Usar las credenciales que la Cloud Function ya tiene asignadas
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

db = firestore.client()

@functions_framework.http
def exportar_libros_a_csv(request):
    try:
        # 1. Obtener los datos de Firestore
        docs = db.collection('libros').stream()
        data = [doc.to_dict() for doc in docs]

        if not data:
            return ('Error: No se encontraron datos en la colección "libros"', 404)

        # 2. Crear el DataFrame con Pandas
        df = pd.DataFrame(data)
        
        # 3. Generar el nombre del archivo y el CSV en memoria
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_name = f'reporte_libros_firestore_{timestamp}.csv'
        csv_data = df.to_csv(index=False, encoding='utf-8')

        # 4. Subir el CSV a Google Cloud Storage (Mismo código que antes)
        storage_client = storage.Client()
        bucket = storage_client.bucket(GCS_BUCKET)
        blob = bucket.blob(file_name)
        blob.upload_from_string(csv_data, content_type='text/csv')
        
        # 5. Generar URL de descarga temporal
        download_url = blob.generate_signed_url(
            version="v4",
            expiration=datetime.timedelta(minutes=60), 
            method="GET"
        )
        
        return download_url, 200

    except Exception as e:
        print(f"Error en la exportación: {str(e)}")
        return f"Error al generar el reporte: {str(e)}", 500