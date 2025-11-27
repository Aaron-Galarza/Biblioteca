import { Button, Container, Overlay, Text, Title } from '@mantine/core';
import { useAuthStore } from '../auth/store';
import classes from '../styles/HeroImageBackground.module.css';

export function HeroImageBackground() {
  const user = useAuthStore(state => state.user);

  const handleClick = () => {
    if (user) {
      window.location.href = "/books";
    } else {
      window.location.href = "/login";
    }
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
            onClick={handleClick}
          >
            Comenzar
          </Button>
        </div>
      </div>
    </div>
  );
}
