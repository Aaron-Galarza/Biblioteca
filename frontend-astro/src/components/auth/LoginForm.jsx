// src/components/auth/LoginForm.jsx
import { useState } from "react";
import {
  Button,
  Container,
  Overlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Group,
  Anchor,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { loginUser } from "../../services/auth.service";
import { useAuthStore } from "../../auth/store";

import classes from "../../styles/LoginHeroImageBackground.module.css";

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const setUser = useAuthStore((state) => state.setUser);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(formData);

      setUser(response.user);

      notifications.show({
        title: "Bienvenido",
        message: "Inicio de sesión exitoso",
        color: "green",
      });

      window.location.href = "/";
    } catch (err) {
      notifications.show({
        title: "Error en Login",
        message: err.message ?? "Credenciales inválidas",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}> Iniciar Sesión </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Ingresa a tu cuenta para gestionar tus reservas y explorar nuestra
            colección de libros digitales.
          </Text>
        </Container>

        <Container size={420} my={40}>
          <form onSubmit={handleSubmit}>
            <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
              <TextInput
                label="Correo"
                name="email"
                required
                radius="md"
                value={formData.email}
                onChange={handleChange}
              />

              <PasswordInput
                label="Contraseña"
                name="password"
                required
                mt="md"
                radius="md"
                value={formData.password}
                onChange={handleChange}
              />

              <Group justify="center">
                <Anchor
                  mt="md"
                  size="sm"
                  underline="always"
                  c="blue"
                  style={{ cursor: "pointer" }}
                  onClick={() => (window.location.href = "/register")}
                >
                  ¿No tienes una cuenta? Regístrate
                </Anchor>
              </Group>

              <Button
                type="submit"
                fullWidth
                mt="xl"
                radius="md"
                variant="filled"
                color="rgba(71, 47, 22, 1)"
                loading={loading}
              >
                Ingresar
              </Button>
            </Paper>
          </form>
        </Container>
      </div>
    </div>
  );
}
