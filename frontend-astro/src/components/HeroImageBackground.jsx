import { Button, Container, Overlay, Text, Title } from '@mantine/core';
import { useAuthStore } from '../auth/store';
import classes from '../styles/HeroImageBackground.module.css';

export function HeroImageBackground() {
  const user = useAuthStore(state => state.user);

  const protectedRoutes = ["/bookings", "/loans", "/fines", "/notifications"];
  const adminRoutes = ["/dashboard"];

  const handleClick = () => {
    if (user) {
      window.location.href = "/books";
    } else {
      window.location.href = "/login";
    }
  };

  const goTo = (route) => {
    const isProtectedRoute = protectedRoutes.some(r => route.startsWith(r));
    const isAdminRoute = adminRoutes.some(r => route.startsWith(r));

    // Si la ruta es protegida (o de admin) Y el usuario NO está logueado...
    if ((isProtectedRoute || isAdminRoute) && !isLoggedIn) {
      // ...lo enviamos a la página de login.
      window.location.href = "/login";
      return; // Detenemos la ejecución
    }

    // Si la ruta es de admin Y el usuario NO es admin...
    if (isAdminRoute && user?.role !== 'ADMIN') {
        // ...lo enviamos a la página de inicio.
        window.location.href = "/";
        return; // Detenemos la ejecución
    }

    // Si pasa las validaciones, procedemos con la navegación normal.
    window.location.href = route;
  };

  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}> Biblioteca Municipal Herrera </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Plataforma digital para reservar y gestionar libros…
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            className={classes.control}
            variant="filled"
            color="rgba(71, 47, 22, 1)"
            size="lg"
            onClick={() => goTo("/books")}
          >
            Comenzar
          </Button>
        </div>
      </div>
    </div>
  );
}
