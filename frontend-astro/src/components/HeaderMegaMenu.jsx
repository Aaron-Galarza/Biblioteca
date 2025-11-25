import { Box, Burger, Button, Divider, Drawer, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '../styles/HeaderMegaMenu.module.css';

import { Link, NavLink } from "react-router-dom";

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <Box >
      <header className={classes.header}>
        <Group justify="space-between" h="100%">

          <Link className={classes.navbar} to="/"> Biblioteca Municipal </Link>

          <Group h="100%" gap={0} visibleFrom="sm">

            <NavLink to="/libros" className={classes.link}> Libros </NavLink>
            <NavLink to="/socios" className={classes.link}> Socios </NavLink>
            <NavLink to="/prestamos" className={classes.link}> Préstamos </NavLink>
            <NavLink to="/multas" className={classes.link}> Multas </NavLink>

          </Group>

          <Group visibleFrom="sm">
            <Button variant="filled" color="rgba(71, 47, 22, 1)">Iniciar Sesión</Button>
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

            <NavLink to="/libros" className={classes.link}> Libros </NavLink>
            <NavLink to="/socios" className={classes.link}> Socios </NavLink>
            <NavLink to="/prestamos" className={classes.link}> Préstamos </NavLink>
            <NavLink to="/multas" className={classes.link}> Multas </NavLink>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="filled" color="#654321">Iniciar Sesión</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}