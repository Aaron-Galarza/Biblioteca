import { Button, Container, Overlay, Text, Title } from '@mantine/core';
import classes from '../styles/HeroImageBackground.module.css';

export function HeroImageBackground() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}> Biblioteca Municipal Herrera </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Plataforma digital para reservar y gestionar libros de la Biblioteca Herrera, un lugar donde la lectura y el conocimiento se encuentran.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button className={classes.control} variant="filled" color="rgba(71, 47, 22, 1)" size="lg">
            Comenzar
          </Button>
        </div>
      </div>
    </div>
  );
}