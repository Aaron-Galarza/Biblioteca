# Usa una imagen base de Python estable
FROM python:3.11-slim

# Evita que Python escriba archivos .pyc en el contenedor
ENV PYTHONDONTWRITEBYTECODE 1
# Fuerza que la salida esté en el búfer, vital para logs en Cloud Run
ENV PYTHONUNBUFFERED 1

# Establece el directorio de trabajo donde estará tu código
WORKDIR /app

# Copia e instala las dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo el código del proyecto Django a la carpeta /app
COPY . /app

# Usa Gunicorn para servir la aplicación Django. 
# $PORT es una variable de entorno proporcionada automáticamente por Cloud Run.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 django_project.wsgi:application