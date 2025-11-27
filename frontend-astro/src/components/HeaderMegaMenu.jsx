// src/components/HeaderMegaMenu.jsx
import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import classes from "../styles/HeaderMegaMenu.module.css";

const protectedRoutes = ["/bookings", "/loans", "/fines", "/notifications"];
const adminRoutes = ["/dashboard"];

/**
 * Decodifica el payload de un token JWT.
 * OJO: Esto NO verifica la firma del token, solo lee su contenido.
 * Es ideal para leer datos no sensibles como el rol en el cliente.
 * @param {string} token El token JWT.
 * @returns {object|null} El payload del token o null si es inválido.
 */
function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64); // atob decodifica Base64
    return JSON.parse(decodedJson);
  } catch (error) {
    console.error("Error al decodificar el token JWT:", error);
    return null;
  }
}

/**
 * Realiza una solicitud al backend para descargar un archivo .zip de la base de datos.
 * La función maneja la autenticación y dispara la descarga en el navegador.
 */
const exportDb = async () => {
  const BASE_URL = import.meta.env.PUBLIC_BACKEND_URL;
  const token = localStorage.getItem("token"); // Obtener el token para la autorización

  // Si no hay token, no podemos continuar.
  if (!token) {
    console.error("No se encontró el token de autenticación.");
    // Opcional: Redirigir al login o mostrar un mensaje de error.
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/export/export-database`, {
      method: "GET", // La descarga de archivos suele ser un GET
      headers: {
        // Incluimos el token de autorización que el backend espera
        "Authorization": `Bearer ${token}`,
      },
      // No se necesita 'credentials' o 'body' para esta solicitud
    });

    if (!response.ok) {
      // Si la respuesta no es exitosa, lanzamos un error
      throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
    }

    // Convertimos la respuesta en un Blob (Binary Large Object)
    const blob = await response.blob();

    // Creamos una URL temporal para el blob
    const url = window.URL.createObjectURL(blob);

    // Creamos un elemento <a> temporal para iniciar la descarga
    const a = document.createElement("a");
    a.style.display = "none"; // Lo hacemos invisible
    a.href = url;

    // Asignamos el nombre del archivo que se descargará
    a.download = "backup-biblioteca.zip";

    // Lo añadimos al cuerpo del documento
    document.body.appendChild(a);
    
    // Simulamos un clic para que se inicie la descarga
    a.click();

    // Limpiamos: revocamos la URL del objeto para liberar memoria
    window.URL.revokeObjectURL(url);
    
    // Eliminamos el elemento <a> del DOM
    document.body.removeChild(a);

  } catch (error) {
    console.error("Error al exportar la base de datos:", error);
    // Aquí podrías mostrar una notificación de error al usuario
  }
};


export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);

    if (loggedInStatus) {
      const token = localStorage.getItem("token");
      const userData = decodeJwtPayload(token);
      setUser(userData);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const goTo = (route) => {
    const isProtectedRoute = protectedRoutes.some(r => route.startsWith(r));
    const isAdminRoute = adminRoutes.some(r => route.startsWith(r));

    if ((isProtectedRoute || isAdminRoute) && !isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    
    if (isAdminRoute && user?.role !== 'ADMIN') {
        window.location.href = "/";
        return;
    }

    window.location.href = route;
  };

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <a className={classes.navbar} href="/">
            Biblioteca Municipal Herrera
          </a>

          {/* ----- NAVEGACIÓN DESKTOP ----- */}
          <Group h="100%" gap={0} visibleFrom="sm">
            <a href="/books" onClick={(e) => { e.preventDefault(); goTo("/books"); }} className={classes.link}>
              Libros
            </a>
            {isLoggedIn && user?.role === "ADMIN" && (
              <>
              <a href="/partners" onClick={(e) => { e.preventDefault(); goTo("/partners"); }} className={classes.link}>
                Socios
              </a>
              
              <a href="/loans" onClick={(e) => { e.preventDefault(); goTo("/loans"); }} className={classes.link}>
                Préstamos
              </a>
              <a href="/fines" onClick={(e) => { e.preventDefault(); goTo("/fines"); }} className={classes.link}>
                Multas
              </a>
              <a href="/populars" onClick={(e) => { e.preventDefault(); goTo("/populars"); }} className={classes.link}>
                Populares
              </a>
              <a href="/actives" onClick={(e) => { e.preventDefault(); goTo("/actives"); }} className={classes.link}>
                Activos
              </a>
              {/* --- BOTÓN DE EXPORTAR ACTUALIZADO --- */}
              <a href="#" onClick={(e) => { e.preventDefault(); exportDb(); }} className={classes.link}>
                Exportar
              </a>
              </>
            )}
          </Group>

          <Group visibleFrom="sm">
            {!isLoggedIn ? (
              <>
                <Button variant="outline" color="rgba(71, 47, 22, 1)" onClick={() => goTo("/register")}>
                  Registrarse
                </Button>
                <Button variant="filled" color="rgba(71, 47, 22, 1)" onClick={() => goTo("/login")}>
                  Iniciar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="filled" color="rgba(71, 47, 22, 1)" onClick={logout}>
                  Cerrar sesión
                </Button>
              </>
            )}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      {/* ----- NAVEGACIÓN MÓVIL (DRAWER) ----- */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="📚 Biblioteca Central"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />
          <a href="/books" onClick={(e) => { e.preventDefault(); closeDrawer(); goTo("/books"); }} className={classes.link}>
            Libros
          </a>
          {isLoggedIn && user?.role === "ADMIN" && (
            <>
              <a href="/partners" onClick={(e) => { e.preventDefault(); closeDrawer(); goTo("/partners"); }} className={classes.link}>
                Socios
              </a>
              
              <a href="/loans" onClick={(e) => { e.preventDefault(); closeDrawer(); goTo("/loans"); }} className={classes.link}>
                Préstamos
              </a>
              <a href="/fines" onClick={(e) => { e.preventDefault(); closeDrawer(); goTo("/fines"); }} className={classes.link}>
                Multas
              </a>
              <a href="/populars" onClick={(e) => { e.preventDefault(); closeDrawer(); goTo("/populars"); }} className={classes.link}>
                Populares
              </a>
              <a href="/actives" onClick={(e) => { e.preventDefault(); closeDrawer(); goTo("/actives"); }} className={classes.link}>
                Activos
              </a>
              {/* --- BOTÓN DE EXPORTAR ACTUALIZADO EN EL DRAWER --- */}
              <a href="#" onClick={(e) => { e.preventDefault(); closeDrawer(); exportDb(); }} className={classes.link}>
                Exportar
              </a>
            </>
          )}

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {!isLoggedIn ? (
              <>
                <Button variant="outline" color="#654321" onClick={() => { closeDrawer(); goTo("/register"); }}>
                  Registrarse
                </Button>
                <Button variant="filled" color="#654321" onClick={() => { closeDrawer(); goTo("/login"); }}>
                  Iniciar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="filled" color="rgba(71, 47, 22, 1)" onClick={logout}>
                  Cerrar sesión
                </Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}