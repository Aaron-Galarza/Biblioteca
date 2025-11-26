// src/components/AuthenticationTitle.jsx

import { useState } from 'react';
import { Button, Checkbox, Container, Group, Paper, PasswordInput, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { registerUser } from '../services/auth.service';

export function AuthenticationTitle() {

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    dni: '',
    telefono: '',
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
          title: 'Dato Inválido',
          message: 'El DNI debe contener solo números.',
          color: 'red',
        });
        setLoading(false);
        return;
      }

      const response = await registerUser(payload);

      notifications.show({
        title: '¡Registro Exitoso!',
        message: 'Ahora puedes iniciar sesión con tus credenciales.',
        color: 'green',
      });

      console.log('Registration successful:', response);

    } catch (error) {
      notifications.show({
        title: 'Error en el Registro',
        message: error.message ?? 'Ocurrió un error.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <form onSubmit={handleSubmit}>
        <Paper withBorder shadow="sm" p={22} mt={30} radius="md">

          <TextInput 
            label="Nombre Completo"
            name="nombre"
            placeholder="Nazareno Beauvais"
            required
            radius="md"
            value={formData.nombre}
            onChange={handleChange}
          />

          <TextInput
            label="DNI"
            name="dni"
            placeholder="4593731"
            required
            radius="md"
            mt="md"
            value={formData.dni}
            onChange={handleChange}
          />

          <TextInput 
            label="Teléfono"
            name="telefono"
            placeholder="+54 3625-678984"
            required
            radius="md"
            mt="md"
            value={formData.telefono}
            onChange={handleChange}
          />

          <TextInput 
            label="Correo"
            name="email"
            placeholder="tu@correo.com"
            required
            radius="md"
            mt="md"
            value={formData.email}
            onChange={handleChange}
          />

          <PasswordInput
            label="Contraseña"
            name="password"
            placeholder="Tu contraseña"
            required
            mt="md"
            radius="md"
            value={formData.password}
            onChange={handleChange}
          />

          <Group justify="space-between" mt="lg">
            <Checkbox label="Recordarme" />
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
  );
}
