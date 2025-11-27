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

// --- YA NO SE NECESITA useAuthStore ---
// import { useAuthStore } from "../auth/store";

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

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  
  // 1. Creamos estados locales para el usuario y el estado de login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // 2. useEffect ahora se encarga de leer TODO desde localStorage
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);

    if (loggedInStatus) {
      const token = localStorage.getItem("token");
      const userData = decodeJwtPayload(token); // Decodificamos el token
      setUser(userData); // Guardamos los datos del usuario en el estado
    }
  }, []); // Se ejecuta solo una vez en el cliente

  // 3. Creamos una función de logout local
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirigimos a login
  };

  const goTo = (route) => {
    const isProtectedRoute = protectedRoutes.some(r => route.startsWith(r));
    const isAdminRoute = adminRoutes.some(r => route.startsWith(r));

    if ((isProtectedRoute || isAdminRoute) && !isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    
    // 4. La lógica de rol ahora usa el estado 'user' local
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
            {isLoggedIn && (
              <>
                <a href="/bookings" onClick={(e) => { e.preventDefault(); goTo("/bookings"); }} className={classes.link}>
                  Reservas
                </a>
                <a href="/loans" onClick={(e) => { e.preventDefault(); goTo("/loans"); }} className={classes.link}>
                  Préstamos
                </a>
                <a href="/fines" onClick={(e) => { e.preventDefault(); goTo("/fines"); }} className={classes.link}>
                  Multas
                </a>
                <a href="/notifications" onClick={(e) => { e.preventDefault(); goTo("/notifications"); }} className={classes.link}>
                  Notificaciones
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
                {/* 5. La comprobación de ADMIN usa el estado local */}
                {user?.role === "ADMIN" && (
                  <Button variant="filled" color="rgba(71, 47, 22, 1)" onClick={() => goTo("/dashboard")}>
                    Dashboard
                  </Button>
                )}
                {/* 6. El botón de logout ahora llama a la función local */}
                <Button ariant="filled" color="rgba(71, 47, 22, 1)" onClick={logout}>
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
          {isLoggedIn && (
            <>
              <a href="/bookings" onClick={(e) => { e.preventDefault(); closeDrawer(); goTo("/bookings"); }} className={classes.link}>
                Reservas
              </a>
              <a href="/loans" onClick={(e) => { e.preventDefault(); closeDrawer(); goTo("/loans"); }} className={classes.link}>
                Préstamos
              </a>
              <a href="/fines" onClick={(e) => { e.preventDefault(); closeDrawer(); goTo("/fines"); }} className={classes.link}>
                Multas
              </a>
              <a href="/notifications" onClick={(e) => { e.preventDefault(); closeDrawer(); goTo("/notifications"); }} className={classes.link}>
                Notificaciones
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
                {user?.role === "ADMIN" && (
                  <Button variant="filled" color="rgba(71, 47, 22, 1)" onClick={() => { closeDrawer(); goTo("/dashboard"); }}>
                    Dashboard
                  </Button>
                )}
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