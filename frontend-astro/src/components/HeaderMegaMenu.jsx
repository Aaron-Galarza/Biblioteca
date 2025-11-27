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
import classes from "../styles/HeaderMegaMenu.module.css";

import { useAuthStore } from "../auth/store";

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { isLoggedIn, user, logout } = useAuthStore();

  // UX guard: si no está logueado vamos a /login (middleware seguirá validando en el servidor)
  const goTo = (route) => {
    const path = route.startsWith("/") ? route : `/${route}`;

    // Rutas públicas (por prefijo)
    const PUBLIC_PREFIXES = ["/login", "/register", "/books"];

    const isPublic = PUBLIC_PREFIXES.some((p) => path.startsWith(p));

    // Restricción: dashboard sólo admin
    if (path === "/dashboard" && user?.role !== "ADMIN") {
      window.location.href = "/";
      return;
    }

    // Guard: usuarios NO logueados
    if (!isLoggedIn && !isPublic) {
      const returnTo = encodeURIComponent(path);
      window.location.href = `/login?returnTo=${returnTo}`;
      return;
    }

    window.location.href = path;
  };

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <a className={classes.navbar} href="/">
            {" "}
            Biblioteca Municipal Herrera{" "}
          </a>

          <Group h="100%" gap={0} visibleFrom="sm">
            <a
              className={classes.link}
              href="/books"
              onClick={(e) => {
                e.preventDefault();
                goTo("/books");
              }}
            >
              Libros
            </a>
            <a
              className={classes.link}
              href="/bookings"
              onClick={(e) => {
                e.preventDefault();
                goTo("/bookings");
              }}
            >
              Reservas
            </a>
            <a
              className={classes.link}
              href="/loans"
              onClick={(e) => {
                e.preventDefault();
                goTo("/loans");
              }}
            >
              Préstamos
            </a>
            <a
              className={classes.link}
              href="/fines"
              onClick={(e) => {
                e.preventDefault();
                goTo("/fines");
              }}
            >
              Multas
            </a>
            <a
              className={classes.link}
              href="/notifications"
              onClick={(e) => {
                e.preventDefault();
                goTo("/notifications");
              }}
            >
              Notificaciones
            </a>
          </Group>

          <Group visibleFrom="sm">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="outline"
                  color="rgba(71, 47, 22, 1)"
                  onClick={() => goTo("/register")}
                >
                  Registrarse
                </Button>
                <Button
                  variant="filled"
                  color="rgba(71, 47, 22, 1)"
                  onClick={() => goTo("/login")}
                >
                  Iniciar Sesión
                </Button>
              </>
            ) : (
              <>
                {user?.role === "ADMIN" && (
                  <Button
                    variant="filled"
                    color="rgba(71, 47, 22, 1)"
                    onClick={() => goTo("/dashboard")}
                  >
                    DASHBOARD
                  </Button>
                )}
                <Button variant="subtle" onClick={() => logout()}>
                  Cerrar sesión
                </Button>
              </>
            )}
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

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
          <a
            className={classes.link}
            href="/books"
            onClick={(e) => {
              e.preventDefault();
              goTo("/books");
            }}
          >
            Libros
          </a>
          <a
            className={classes.link}
            href="/bookings"
            onClick={(e) => {
              e.preventDefault();
              goTo("/bookings");
            }}
          >
            Reservas
          </a>
          <a
            className={classes.link}
            href="/loans"
            onClick={(e) => {
              e.preventDefault();
              goTo("/loans");
            }}
          >
            Préstamos
          </a>
          <a
            className={classes.link}
            href="/fines"
            onClick={(e) => {
              e.preventDefault();
              goTo("/fines");
            }}
          >
            Multas
          </a>
          <a
            className={classes.link}
            href="/notifications"
            onClick={(e) => {
              e.preventDefault();
              goTo("/notifications");
            }}
          >
            Notificaciones
          </a>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="outline"
                  color="#654321"
                  onClick={() => goTo("/register")}
                >
                  Registrarse
                </Button>
                <Button
                  variant="filled"
                  color="#654321"
                  onClick={() => goTo("/login")}
                >
                  Iniciar Sesión
                </Button>
              </>
            ) : (
              <>
                {user?.role === "ADMIN" && (
                  <Button
                    variant="filled"
                    color="rgba(71, 47, 22, 1)"
                    onClick={() => goTo("/dashboard")}
                  >
                    DASHBOARD
                  </Button>
                )}
                <Button variant="subtle" onClick={() => logout()}>
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
