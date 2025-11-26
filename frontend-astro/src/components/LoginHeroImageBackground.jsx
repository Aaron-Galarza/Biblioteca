import { Button, Container, Overlay, Text, Title } from '@mantine/core';
import classes from '../styles/LoginHeroImageBackground.module.css';
import { AuthenticationTitle } from './AuthenticationTitle';

export function LoginHeroImageBackground() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>

        <Title className={classes.title}> Bienvenido </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Ingresa a tu cuenta para gestionar tus reservas y explorar nuestra colección de libros digitales.
          </Text>
        </Container>
        <AuthenticationTitle/>

      </div>
    </div>
  );
}