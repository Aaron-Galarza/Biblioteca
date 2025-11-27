// src/components/auth/RegisterForm.jsx
import { useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  Group,
  Overlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Anchor,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { registerUser } from "../../services/auth.service";

import classes from "../../styles/LoginHeroImageBackground.module.css";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    dni: "",
    telefono: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        dni: parseInt(formData.dni, 10),
      };

      if (isNaN(payload.dni)) {
        notifications.show({
          title: "Dato Inválido",
          message: "El DNI debe contener solo números.",
          color: "red",
        });
        setLoading(false);
        return;
      }

      await registerUser(payload);

      notifications.show({
        title: "¡Registro Exitoso!",
        message: "Ahora puedes iniciar sesión.",
        color: "green",
      });

      window.location.replace("/login");
    } catch (error) {
      notifications.show({
        title: "Error en el Registro",
        message: error.message ?? "Ocurrió un error.",
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
        <Title className={classes.title}> Crear Cuenta </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Completa tus datos para crear una cuenta en nuestra biblioteca
            digital.
          </Text>
        </Container>

        <Container size={420} my={40}>
          <form onSubmit={handleSubmit}>
            <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
              <TextInput
                label="Nombre Completo"
                name="nombre"
                required
                radius="md"
                value={formData.nombre}
                onChange={handleChange}
              />

              <TextInput
                label="DNI"
                name="dni"
                required
                radius="md"
                mt="md"
                value={formData.dni}
                onChange={handleChange}
              />

              <TextInput
                label="Teléfono"
                name="telefono"
                required
                radius="md"
                mt="md"
                value={formData.telefono}
                onChange={handleChange}
              />

              <TextInput
                label="Correo"
                name="email"
                required
                radius="md"
                mt="md"
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
                  onClick={() => (window.location.href = "/login")}
                >
                  ¿Ya tienes una cuenta?
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
                Crear Cuenta
              </Button>
            </Paper>
          </form>
        </Container>
      </div>
    </div>
  );
}
