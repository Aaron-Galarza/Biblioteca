// src/components/FinesPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  MantineProvider,
  Container,
  Paper,
  Title,
  TextInput,
  Button,
  Group,
  Table,
  Badge,
  ActionIcon,
  Text,
  NumberInput,
  Select,
} from "@mantine/core";
import { DateInput } from "@mantine/dates"; // Para un selector de fecha moderno
import { notifications } from "@mantine/notifications";
import { IconFileX } from "@tabler/icons-react";

import { HeaderMegaMenu } from "./HeaderMegaMenu";
import classes from "../styles/PageLayout.module.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import '@mantine/dates/styles.css'; // Estilos para el calendario

// --- Helper para decodificar JWT ---
function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

// --- Cliente de API reutilizable ---
const createApiClient = () => {
  const BASE_URL = import.meta.env.PUBLIC_BACKEND_URL;
  const getToken = () => localStorage.getItem("token");

  const request = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Ocurrió un error en la petición.");
    }
    // Si la respuesta no tiene contenido (ej. en un DELETE), devolvemos un objeto vacío
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return {};
  };

  return {
    get: (endpoint) => request(endpoint),
    post: (endpoint, body) => request(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: (endpoint, body) => request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  };
};

const api = createApiClient();

// --- Componente principal ---
export default function FinesPage() {
  const [fines, setFines] = useState([]);
  const [socios, setSocios] = useState([]);
  const [formData, setFormData] = useState({
    idSocio: "",
    motivo: "",
    monto: 0,
    fecha: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Cargar datos del usuario y datos correspondientes a su rol
  const fetchData = useCallback(async (currentUser) => {
    try {
      if (currentUser.role === "ADMIN") {
        // El admin necesita la lista de todos los socios para el formulario
        const [finesData, sociosData] = await Promise.all([
          api.get("/fines"),
          api.get("/partners"),
        ]);
        setFines(finesData);
        setSocios(sociosData);
      } else {
        // Un usuario normal solo ve sus propias multas
        const finesData = await api.get(`/fines/socio/${currentUser.idSocio}`);
        setFines(finesData);
      }
    } catch (error) {
      notifications.show({ title: "Error", message: `No se pudieron cargar los datos: ${error.message}`, color: "red" });
    }
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = decodeJwtPayload(token);
    if (payload) {
      setUser(payload);
      fetchData(payload);
    }
  }, [fetchData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
          ...formData,
          fecha: formData.fecha.toISOString().split('T')[0] // Formato YYYY-MM-DD
      }
      await api.post("/fines", payload);
      notifications.show({ title: "Éxito", message: "Multa registrada correctamente.", color: "green" });
      setFormData({ idSocio: "", motivo: "", monto: 0, fecha: new Date() });
      fetchData(user);
    } catch (error) {
      notifications.show({ title: "Error", message: error.message, color: "red" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelFine = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar esta multa?")) {
      try {
        await api.put(`/fines/${id}/cancel`);
        notifications.show({ title: "Éxito", message: "Multa cancelada correctamente.", color: "blue" });
        fetchData(user);
      } catch (error) {
        notifications.show({ title: "Error", message: error.message, color: "red" });
      }
    }
  };
  
  const sociosOptions = socios.map(socio => ({
    value: socio.idSocio,
    label: `${socio.nombre} (${socio.email})`
  }));

  const rows = fines.map((fine) => (
    <Table.Tr key={fine.idMulta}>
      {user?.role === "ADMIN" && <Table.Td>{fine.Socio?.nombre || 'N/A'}</Table.Td>}
      <Table.Td>{fine.motivo}</Table.Td>
      <Table.Td>${parseFloat(fine.monto).toFixed(2)}</Table.Td>
      <Table.Td>{new Date(fine.fecha).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Badge color={fine.estado === "ACTIVA" ? "red" : "green"} variant="light">
          {fine.estado}
        </Badge>
      </Table.Td>
      {user?.role === "ADMIN" && (
        <Table.Td>
          {fine.estado === "ACTIVA" && (
            <ActionIcon variant="subtle" color="red" onClick={() => handleCancelFine(fine.idMulta)}>
              <IconFileX size={16} />
            </ActionIcon>
          )}
        </Table.Td>
      )}
    </Table.Tr>
  ));

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <HeaderMegaMenu />
      <div className={classes.wrapper}>
        <Container size="lg" my="xl">
          {/* <Title order={1} ta="center" mb="xl">
            Gestión de Multas
          </Title> */}

          <Title order={1} ta="center" mb="xl"className={classes.title}> Catálogo de Libros </Title>

          {user?.role === "ADMIN" && (
            <Paper withBorder shadow="md" p="lg" mb="xl" radius="md">
              <Title order={3} mb="md">Registrar Nueva Multa</Title>
              <form onSubmit={handleSubmit}>
                <Select
                  label="Socio"
                  placeholder="Selecciona un socio"
                  data={sociosOptions}
                  value={formData.idSocio}
                  onChange={(value) => handleChange('idSocio', value)}
                  searchable
                  required
                />
                <TextInput label="Motivo" name="motivo" value={formData.motivo} onChange={(e) => handleChange('motivo', e.currentTarget.value)} mt="md" required />
                <Group grow mt="md">
                  <NumberInput label="Monto" name="monto" value={formData.monto} onChange={(value) => handleChange('monto', value)} min={0} step={0.50} precision={2} required />
                  <DateInput label="Fecha de la Multa" name="fecha" value={formData.fecha} onChange={(date) => handleChange('fecha', date)} valueFormat="YYYY-MM-DD" required />
                </Group>
                <Group justify="flex-end" mt="xl">
                  <Button type="submit" loading={loading} color="rgba(71, 47, 22, 1)">
                    Registrar Multa
                  </Button>
                </Group>
              </form>
            </Paper>
          )}

          <Paper withBorder shadow="md" p="lg" radius="md">
            <Title order={3} mb="md">{user?.role === 'ADMIN' ? 'Lista de Multas' : 'Mis Multas'}</Title>
            {fines.length > 0 ? (
              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    {user?.role === "ADMIN" && <Table.Th>Socio</Table.Th>}
                    <Table.Th>Motivo</Table.Th>
                    <Table.Th>Monto</Table.Th>
                    <Table.Th>Fecha</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    {user?.role === "ADMIN" && <Table.Th>Acciones</Table.Th>}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            ) : (
              <Text c="dimmed" ta="center">No tienes multas registradas.</Text>
            )}
          </Paper>
        </Container>
      </div>
    </MantineProvider>
  );
}