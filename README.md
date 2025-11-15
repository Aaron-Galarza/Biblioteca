# Sistema de Gestión de Biblioteca Municipal

### 1. Descripción General

El **Sistema de Gestión de Biblioteca** es una aplicación de página única (SPA) diseñada para administrar los recursos de la biblioteca. La arquitectura es Serverless, con el Frontend desacoplado del Backend, lo que garantiza eficiencia en costos y alta escalabilidad.

Incluye la gestión (CRUD) de **Libros, Socios, Préstamos y Multas**.

---

### 2. Arquitectura y Stack Tecnológico

El proyecto opera bajo una **Arquitectura en Capas** con el patrón **MVC** embebido en el Backend.

| Componente | Tecnología | Rol Principal |
| :--- | :--- | :--- |
| **Frontend (UI)** | **React.js + Axios** | Interfaz de usuario y enrutamiento (SPA). |
| **Backend (API)** | **Node.js + Express** | Lógica de negocio (Servicios), desplegado en **Cloud Functions/Run**. |
| **Base de Datos** | **Google Cloud Firestore** | Persistencia NoSQL de todas las colecciones. |
| **Estilos** | **Bootstrap 5** | Diseño responsive. |
| **Hosting Frontend** | **GitHub Pages** | Alojamiento estático del Frontend (`gh-pages`). |

---

### 3. Estructura del Repositorio

La organización del código se divide por responsabilidad:

```
BibliotecaApp/
├── backend/
│   ├── functions/ 
│   │   ├── src/
│   │   │   ├── controllers/ (HTTP handlers)
│   │   │   ├── services/ (Lógica de negocio y acceso a Firestore)
│   │   │   └── routes/ (Definición de rutas)
│
└── frontend/
    ├── src/
    │   ├── pages/ (Vistas principales)
    │   └── services/api.js (Cliente Axios)
    └── package.json (Scripts de 'deploy')
```

---

### 4. Instalación y Ejecución Local

Para el desarrollo local, se requiere **Node.js** y la **Firebase CLI** instalada globalmente.

#### 4.1. Backend (Cloud Functions)

1.  **Instalar dependencias:** Navegar a `backend/functions` y ejecutar `npm install`.
2.  **Autenticación:** El colaborador debe autenticar su terminal con el proyecto vía `firebase login` y luego vincular el repositorio con `firebase use --add`.
3.  **Iniciar Emuladores:**
    ```bash
    firebase emulators:start
    ```

#### 4.2. Frontend (React)

1.  **Instalar dependencias:** Navegar a `frontend` y ejecutar `npm install`.
2.  **Iniciar la Interfaz:**
    ```bash
    npm start
    ```

---

### 5. Endpoints Principales

La aplicación utiliza un API REST con los siguientes flujos clave:

| Recurso | Método | Ruta | Función |
| :--- | :--- | :--- | :--- |
| **Libros, Socios** | `GET` / `POST` / `PUT` / `DELETE` | `/api/libros`, `/api/socios` | Gestión completa de entidades. |
| **Préstamos** | `POST` | `/api/prestamos` | Registrar un nuevo préstamo. |
| **Devoluciones** | `POST` | `/api/prestamos/:id/devolver` | Cerrar préstamo y generar multa si aplica. |
| **Multas** | `POST` | `/api/multas/:id/cancelar` | Cancelar (pagar) una multa activa. |

---

### 6. Consideraciones Técnicas

* **Autenticación:** El Backend usa `firebase-admin` para autenticarse automáticamente en Google Cloud, no requiriendo archivos `.env` para credenciales de base de datos.
* **Enrutamiento:** El Frontend utiliza **`HashRouter`** para garantizar que la recarga (F5) no resulte en un error 404 en el alojamiento estático de GitHub Pages.
* **Calidad:** El proyecto utiliza **Jest/Supertest** para pruebas automatizadas de la lógica de negocio y los *endpoints*.

---
