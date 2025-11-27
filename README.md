---

# Sistema de Gestión de Biblioteca Municipal

### 1. Descripción General

El **Sistema de Gestión de Biblioteca** es una plataforma de administración de recursos bibliotecarios basada en una arquitectura **Serverless y de microservicios híbrida**.

El proyecto se compone de un **Frontend SPA** desacoplado y un **Backend distribuido**, desplegado en distintos servicios de Google Cloud. La aplicación administra **Libros, Socios, Préstamos, Multas, Reservas, Reportes y Exportaciones completas de la base de datos**.

---

### 2. Arquitectura y Stack Tecnológico

El sistema implementa una **Arquitectura en Capas**, combinando un núcleo principal en **Node.js/Express** y un microservicio adicional en **Django/Python** para tareas pesadas.

| Componente                    | Tecnología                          | Rol Principal                                  |
| :---------------------------- | :---------------------------------- | :--------------------------------------------- |
| **Frontend (UI)**             | Astro                               | Interface SPA del usuario.                     |
| **API Principal**             | Node.js + Express (Cloud Functions) | Endpoints REST, lógica de negocio y seguridad. |
| **Microservicio de Reportes** | Python + Django (Cloud Run)         | Exportación completa de Firestore a CSV/ZIP.   |
| **Base de Datos**             | Google Cloud Firestore              | Persistencia NoSQL.                            |
| **Almacenamiento**            | Google Cloud Storage                | Archivos generados (ZIP/CSV).                  |
| **Secretos**                  | Google Secret Manager               | JWT_SECRET para autenticación.                 |
| **Estilos**                   | Bootstrap 5                         | Diseño responsive.                             |
| **Hosting Frontend**          | GitHub Pages                        | Despliegue estático vía `gh-pages`.            |

---

### 3. Estructura del Repositorio

```
BibliotecaApp/
├── backend/
│   ├── functions/
│   │   ├── src/
│   │   │   ├── controllers/    # HTTP handlers Express
│   │   │   ├── services/       # Lógica de negocio + Firestore
│   │   │   ├── middlewares/    # JWT, permisos
│   │   │   └── routes/         # Definición de endpoints
│
├── backend/
│   ├── django-reports/         # Microservicio Python (Cloud Run)
│       ├── export/             # Generación ZIP/CSV
│       ├── collections/        # Exploración de Firestore
│
└── frontend-astro/
    ├── src/
    │   ├── pages/
    │   └── services/api.js
```

---

### 4. Instalación y Ejecución Local

#### 4.1. Backend (Cloud Functions - Node)

1. Instalar dependencias

   ```
   cd backend/functions
   npm install
   ```
2. Autenticación

   ```
   firebase login
   firebase use --add
   ```
3. Ejecutar emuladores

   ```
   firebase emulators:start
   ```

#### 4.2. Microservicio Reports (Django)

El microservicio está diseñado para ejecutarse en Cloud Run, pero también puede levantarse localmente:

```
cd backend/django-reports
pip install -r requirements.txt
python manage.py runserver
```

#### 4.3. Frontend

```
cd frontend
npm install
npm start
```

---

### 5. Endpoints del Sistema (API REST Completa)

A continuación se detalla el conjunto completo de endpoints del Backend (Node.js + Django).
La API está organizada en módulos, con políticas de acceso basadas en **JWT + Roles**.

---

## 5.1. Autenticación (Auth)

| Método | Ruta             | Descripción                   | Acceso      |
| :----- | :--------------- | :---------------------------- | :---------- |
| POST   | `/auth/register` | Registrar usuario             | Público     |
| POST   | `/auth/login`    | Login y generación de JWT     | Público     |
| GET    | `/auth/profile`  | Obtener información del token | Autenticado |

---

## 5.2. Libros (Books)

| Método | Ruta                       | Descripción                                    | Acceso                                 |
| :----- | :------------------------- | :--------------------------------------------- | :------------------------------------- |
| GET    | `/books/`                  | Listar libros (filtros: título, autor, estado) | Público                                |
| GET    | `/books/:id`               | Obtener libro por ID                           | Público                                |
| POST   | `/books/`                  | Crear libro                                    | Admin                                  |
| PUT    | `/books/:id`               | Actualizar libro                               | Admin                                  |
| DELETE | `/books/:id`               | Eliminar libro                                 | Admin                                  |
| POST   | `/books/:id/booking`       | Crear reserva                                  | Usuario (el código actual exige Admin) |
| POST   | `/books/:idBooking/cancel` | Cancelar reserva                               | Usuario                                |

---

## 5.3. Socios (Partners)

| Método | Ruta                          | Descripción                  | Acceso  |
| :----- | :---------------------------- | :--------------------------- | :------ |
| GET    | `/partners/`                  | Listar socios                | Público |
| GET    | `/partners/:id`               | Obtener socio                | Público |
| POST   | `/partners/`                  | Crear socio                  | Admin   |
| PUT    | `/partners/:id`               | Actualizar socio             | Admin   |
| DELETE | `/partners/:id`               | Eliminar socio               | Admin   |
| GET    | `/partners/:id/loan`          | Préstamos del socio          | Usuario |
| GET    | `/partners/:id/fines`         | Multas del socio             | Usuario |
| GET    | `/partners/:id/notifications` | Préstamos + Multas del socio | Usuario |

---

## 5.4. Préstamos (Loans)

| Método | Ruta                    | Descripción                  | Acceso  |
| :----- | :---------------------- | :--------------------------- | :------ |
| GET    | `/loans/`               | Listar préstamos activos     | Público |
| POST   | `/loans/`               | Crear préstamo (transacción) | Admin   |
| PUT    | `/loans/:idLoan/return` | Registrar devolución         | Usuario |
| POST   | `/loans/:idLoan/extend` | Extender préstamo            | Usuario |

---

## 5.5. Multas (Fines)

| Método | Ruta                       | Descripción    | Acceso |
| :----- | :------------------------- | :------------- | :----- |
| GET    | `/fines/`                  | Listar multas  | Admin  |
| POST   | `/fines/`                  | Crear multa    | Admin  |
| PUT    | `/fines/:idMulta/cancelar` | Cancelar multa | Admin  |

---

## 5.6. Configuración General (Config)

| Método | Ruta       | Descripción                  | Acceso  |
| :----- | :--------- | :--------------------------- | :------ |
| GET    | `/config/` | Obtener configuración global | Público |

---

## 5.7. Reportes del Sistema (Node)

| Método | Ruta                      | Descripción          | Acceso  |
| :----- | :------------------------ | :------------------- | :------ |
| GET    | `/reports/popular-books`  | Libros más populares | Público |
| GET    | `/reports/active-members` | Socios más activos   | Público |
| GET    | `/reports/vencidos`       | Préstamos morosos    | Público |

---

## 5.8. Exportación y Backup (Functions → Django → GCS)

| Método | Ruta                      | Descripción                                     | Acceso |
| :----- | :------------------------ | :---------------------------------------------- | :----- |
| GET    | `/export/export-database` | Genera un ZIP con CSVs de todas las colecciones | Admin  |

Este endpoint actúa como **proxy** hacia el microservicio Django desplegado en Cloud Run.

---

## 5.9. Importación (Solo Desarrollo)

| Método | Ruta                | Descripción                             | Acceso     |
| :----- | :------------------ | :-------------------------------------- | :--------- |
| POST   | `/import/load-data` | Importar `data_import.json` a Firestore | Desarrollo |

---

## 5.10. Microservicio Django (Cloud Run)

### Export

| Método | Ruta            | Descripción                                   |
| :----- | :-------------- | :-------------------------------------------- |
| GET    | `/export/`      | Exporta todas las colecciones a ZIP           |
| GET    | `/collections/` | Muestra lista de colecciones, conteo y sample |

---

### 6. Consideraciones Técnicas

* **Autenticación:** JWT firmado con `JWT_SECRET` almacenado en Secret Manager.
* **Base de Datos:** Acceso a Firestore desde Node y Python mediante credenciales de servicio.
* **Transacciones:** Operaciones críticas (creación de préstamos, reservas o devoluciones) usan `db.runTransaction`.
* **Enrutamiento Frontend:** Uso de **HashRouter** para evitar errores 404 en GitHub Pages.
* **Pruebas:** Integración entre Functions → Django → Firestore → GCS verificada y estable.

---

## Spacely Supervivientes:

- `https://github.com/nazabe`
- `https://github.com/Aaron-Galarza`

---
