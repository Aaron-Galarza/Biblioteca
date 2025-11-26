from rest_framework.decorators import api_view
from rest_framework.response import Response
import firebase_admin
from firebase_admin import credentials, firestore
import csv
import io
import zipfile
from django.http import HttpResponse
from datetime import datetime

def get_firestore_client():
    """Inicializa Firebase"""
    try:
        if not firebase_admin._apps:
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        print(f"❌ Error inicializando Firebase: {str(e)}")
        raise

def get_all_collections_data(db):
    """Obtiene TODOS los datos de TODAS las colecciones"""
    collections_data = {}
    
    try:
        # Obtener lista de todas las colecciones
        collections = db.collections()
        
        for collection in collections:
            collection_name = collection.id
            print(f"📂 Procesando colección: {collection_name}")
            
            # Obtener todos los documentos de la colección
            docs = collection.stream()
            collection_data = []
            all_fieldnames = set()  # Usar set para evitar duplicados
            
            for doc in docs:
                doc_data = doc.to_dict()
                doc_data['_id'] = doc.id  # Agregar ID del documento
                collection_data.append(doc_data)
                
                # Recoger TODOS los campos de TODOS los documentos
                all_fieldnames.update(doc_data.keys())
            
            collections_data[collection_name] = {
                'data': collection_data,
                'fieldnames': sorted(list(all_fieldnames))  # Ordenar campos alfabéticamente
            }
            print(f"   ✅ {len(collection_data)} documentos, {len(all_fieldnames)} campos en {collection_name}")
    
    except Exception as e:
        print(f"❌ Error obteniendo colecciones: {str(e)}")
        raise
    
    return collections_data

@api_view(['GET'])
def export_database_view(request):
    """
    Exporta TODA la base de datos de Firebase a un ZIP con múltiples CSVs
    """
    try:
        print("🗃️ Exportando TODA la base de datos...")
        
        # 1. Conectar a Firebase
        db = get_firestore_client()
        
        # 2. Obtener TODAS las colecciones y sus datos
        all_data = get_all_collections_data(db)
        
        if not all_data:
            return Response({"error": "No hay datos en la base de datos"}, status=404)

        # 3. Crear archivo ZIP en memoria con múltiples CSVs
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for collection_name, collection_info in all_data.items():
                collection_data = collection_info['data']
                fieldnames = collection_info['fieldnames']
                
                if collection_data:  # Solo crear CSV si hay datos
                    # Crear CSV para esta colección
                    output = io.StringIO()
                    
                    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
                    writer.writeheader()
                    
                    for doc_data in collection_data:
                        # Asegurar que todos los campos existan (llenar con vacío si no)
                        row = {field: doc_data.get(field, '') for field in fieldnames}
                        writer.writerow(row)
                    
                    csv_content = output.getvalue()
                    output.close()
                    
                    # Agregar CSV al ZIP
                    csv_filename = f"{collection_name}.csv"
                    zip_file.writestr(csv_filename, csv_content)
                    
                    print(f"✅ CSV creado: {csv_filename} ({len(collection_data)} registros, {len(fieldnames)} campos)")

        zip_buffer.seek(0)
        
        # 4. Crear respuesta HTTP para descarga directa del ZIP
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"backup_biblioteca_completo_{timestamp}.zip"
        
        response = HttpResponse(zip_buffer.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        response['X-Collections-Count'] = len(all_data)
        
        total_records = sum(len(info['data']) for info in all_data.values())
        print(f"🎉 Backup completo: {len(all_data)} colecciones, {total_records} registros totales")
        
        return response
        
    except Exception as e:
        print(f"❌ Error exportando base de datos: {str(e)}")
        import traceback
        print(f"🔍 Traceback: {traceback.format_exc()}")
        return Response({"error": f"Error al exportar base de datos: {str(e)}"}, status=500)

@api_view(['GET']) 
def export_collections_list_view(request):
    """
    Endpoint para ver qué colecciones existen en la base de datos
    """
    try:
        db = get_firestore_client()
        all_data = get_all_collections_data(db)
        
        collections_info = {}
        for collection_name, collection_info in all_data.items():
            collections_info[collection_name] = {
                'document_count': len(collection_info['data']),
                'fields': collection_info['fieldnames'],
                'sample_data': collection_info['data'][0] if collection_info['data'] else {}
            }
        
        return Response({
            'success': True,
            'collections': collections_info,
            'total_collections': len(all_data),
            'total_documents': sum(len(info['data']) for info in all_data.values())
        })
        
    except Exception as e:
        return Response({"error": f"Error obteniendo colecciones: {str(e)}"}, status=500)