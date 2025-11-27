// src/components/MembersPage.jsx
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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPencil, IconTrash } from "@tabler/icons-react";

import { HeaderMegaMenu } from "./HeaderMegaMenu";
import classes from "../styles/PageLayout.module.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// --- Helper para decodificar JWT ---
function decodeJwtPayload(token) {
  if (!token) return null;
  try { return JSON.parse(atob(token.split(".")[1])); }
  catch (e) { return null; }
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
      throw new Error(errorData.error || "Ocurrió un error.");
    }
    const contentType = response.headers.get("content-type");
    return contentType?.includes("application/json") ? response.json() : {};
  };

  return {
    get: (endpoint) => request(endpoint),
    post: (endpoint, body) => request(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: (endpoint, body) => request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    delete: (endpoint) => request(endpoint, { method: "DELETE" }),
  };
};

const api = createApiClient();

// --- Componente principal ---
export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({ nombre: "", dni: "", email: "", telefono: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const fetchMembers = useCallback(async () => {
    try {
      const data = await api.get("/partners");
      setMembers(data);
    } catch (error) {
      notifications.show({ title: "Error", message: `No se pudieron cargar los partners: ${error.message}`, color: "red" });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = decodeJwtPayload(token);
    if (payload?.role === "ADMIN") {
      setUser(payload);
      fetchMembers();
    } else {
      // Si el usuario no es admin, redirigir inmediatamente
      notifications.show({ title: "Acceso Denegado", message: "Esta página es solo para administradores.", color: "red" });
      window.location.href = '/';
    }
  }, [fetchMembers]);
  
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingMemberId(null);
    setFormData({ nombre: "", dni: "", email: "", telefono: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Nota: El backend maneja el registro y la creación de contraseña.
      // Aquí solo gestionamos los datos del socio.
      if (isEditing) {
        await api.put(`/partners/${editingMemberId}`, formData);
        notifications.show({ title: "Éxito", message: "Socio actualizado correctamente.", color: "green" });
      } else {
        // La creación de un socio desde el panel de admin podría tener una lógica diferente
        // (ej. sin contraseña). Asumimos que la API lo maneja.
        await api.post("/partners", formData);
        notifications.show({ title: "Éxito", message: "Socio registrado correctamente.", color: "green" });
      }
      handleCancel();
      fetchMembers();
    } catch (error) {
      notifications.show({ title: "Error", message: error.message, color: "red" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsEditing(true);
    setEditingMemberId(member.idSocio);
    setFormData({
      nombre: member.nombre,
      dni: member.dni,
      email: member.email,
      telefono: member.telefono,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este socio? Esta acción es irreversible.")) {
      try {
        await api.delete(`/partners/${id}`);
        notifications.show({ title: "Éxito", message: "Socio eliminado correctamente.", color: "orange" });
        fetchMembers();
      } catch (error) {
        notifications.show({ title: "Error", message: error.message, color: "red" });
      }
    }
  };
  
  const rows = members.map((member) => (
    <Table.Tr key={member.idSocio}>
      <Table.Td>{member.nombre}</Table.Td>
      <Table.Td>{member.dni}</Table.Td>
      <Table.Td>{member.email}</Table.Td>
      <Table.Td>
        <Badge color="blue" variant="light">
          {member.idSocio.substring(0, 8)} 
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="sm">
          <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(member)}>
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(member.idSocio)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));
  
  // Si el usuario aún no se ha verificado, no renderizar nada para evitar un parpadeo
  if (!user) return null;

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <HeaderMegaMenu />
      <div className={classes.wrapper}>
        <Container size="lg" my="xl">
          {/* <Title order={1} ta="center" mb="xl">
            Gestión de partners
          </Title> */}

          <Title order={1} ta="center" mb="xl"className={classes.title}> Gestión de Socios </Title>

          <Paper withBorder shadow="md" p="lg" mb="xl" radius="md">
            <Title order={3} mb="md">{isEditing ? "Editar Socio" : "Registrar Nuevo Socio"}</Title>
            <form onSubmit={handleSubmit}>
              <Group grow>
                <TextInput label="Nombre Completo" name="nombre" value={formData.nombre} onChange={handleChange} required />
                <TextInput label="DNI" name="dni" value={formData.dni} onChange={handleChange} required />
              </Group>
              <Group grow mt="md">
                <TextInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <TextInput label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} />
              </Group>
              <Group justify="flex-end" mt="xl">
                {isEditing && <Button variant="default" onClick={handleCancel}>Cancelar</Button>}
                <Button type="submit" loading={loading} color="rgba(71, 47, 22, 1)">
                  {isEditing ? "Guardar Cambios" : "Registrar Socio"}
                </Button>
              </Group>
            </form>
          </Paper>

          <Paper withBorder shadow="md" p="lg" radius="md">
            <Title order={3} mb="md">Lista de partners</Title>
            {members.length > 0 ? (
              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>DNI</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>ID de Socio</Table.Th>
                    <Table.Th>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            ) : (
              <Text c="dimmed" ta="center">No hay partners registrados.</Text>
            )}
          </Paper>
        </Container>
      </div>
    </MantineProvider>
  );
}