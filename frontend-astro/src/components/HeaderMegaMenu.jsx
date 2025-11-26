import { Box, Burger, Button, Divider, Drawer, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, NavLink, useNavigate } from "react-router-dom";

import classes from '../styles/HeaderMegaMenu.module.css';

import { useAuthStore } from '../auth/store.js';

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const { isLoggedIn, user } = useAuthStore();

  const handleLogin = (route) => { 
    if (isLoggedIn) {
      window.location.href = `/${route}`; 
    } if (user?.role === 'ADMIN' && route === 'dashboard') {
      window.location.href = '/dashboard'; 
    } else {
      window.location.href = '/login'; 
    }
  };

  return (
    <Box >
      <header className={classes.header}>
        <Group justify="space-between" h="100%">

          <Link className={classes.navbar} to="/"> Biblioteca Municipal Herrera </Link>

          <Group h="100%" gap={0} visibleFrom="sm">

            <NavLink to="/books" className={classes.link} onClick={handleLogin}> Libros </NavLink>
            <NavLink to="/bookings" className={classes.link} onClick={handleLogin}> Reservas </NavLink>
            <NavLink to="/loans" className={classes.link} onClick={handleLogin}> Préstamos </NavLink>
            <NavLink to="/fines" className={classes.link} onClick={handleLogin}> Multas </NavLink>
            <NavLink to="/notifications" className={classes.link} onClick={handleLogin}> Notificaciones </NavLink>

          </Group>

          <Group visibleFrom="sm">

            {!isLoggedIn && (
              <>
                <Button variant="filled" color="rgba(71, 47, 22, 1)" onClick={handleLogin}>Iniciar Sesión</Button>
              </>
            )}

            {user?.role === 'ADMIN' && (
              <Button variant="filled" color="rgba(71, 47, 22, 1)" onClick={handleLogin}>DASHBOARD</Button>
            )}

          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
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
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="sm" />

            <NavLink to="/books" className={classes.link} onClick={handleLogin}> Libros </NavLink>
            <NavLink to="/bookings" className={classes.link} onClick={handleLogin}> Reservas </NavLink>
            <NavLink to="/loans" className={classes.link} onClick={handleLogin}> Préstamos </NavLink>
            <NavLink to="/fines" className={classes.link} onClick={handleLogin}> Multas </NavLink>
            <NavLink to="/notifications" className={classes.link} onClick={handleLogin}> Notificaciones </NavLink>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {!isLoggedIn && (
              <>
                <Button variant="filled" color="#654321" onClick={handleLogin}>Iniciar Sesión</Button>
              </>
            )}
            {user?.role === 'ADMIN' && (
              <Button variant="filled" color="rgba(71, 47, 22, 1)" onClick={handleLogin}>DASHBOARD</Button>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}