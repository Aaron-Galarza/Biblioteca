// src/components/BooksPage.jsx
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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPencil, IconTrash } from "@tabler/icons-react";

import { HeaderMegaMenu } from "./HeaderMegaMenu";
import classes from "../styles/PageLayout.module.css"; // Usaremos un estilo de layout genérico
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

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
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Ocurrió un error en la petición.");
    }
    return response.json();
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
export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    genero: "",
    cantidadDisponible: 1,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Cargar el rol del usuario al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = decodeJwtPayload(token);
    setUserRole(payload?.role || "USER");
  }, []);
  
  // Cargar libros
  const fetchBooks = useCallback(async () => {
    try {
      const data = await api.get("/books");
      setBooks(data);
    } catch (error) {
      notifications.show({
        title: "Error al cargar libros",
        message: error.message,
        color: "red",
      });
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleNumberChange = (value) => {
    setFormData((prev) => ({ ...prev, cantidadDisponible: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingBookId(null);
    setFormData({ titulo: "", autor: "", isbn: "", genero: "", cantidadDisponible: 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/books/${editingBookId}`, formData);
        notifications.show({ title: "Éxito", message: "Libro actualizado correctamente", color: "green" });
      } else {
        await api.post("/books", formData);
        notifications.show({ title: "Éxito", message: "Libro agregado correctamente", color: "green" });
      }
      handleCancel();
      fetchBooks();
    } catch (error) {
      notifications.show({ title: "Error", message: error.message, color: "red" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll hacia arriba para ver el form
    setIsEditing(true);
    setEditingBookId(book.idLibro);
    setFormData({
      titulo: book.titulo,
      autor: book.autor,
      isbn: book.isbn,
      genero: book.genero,
      cantidadDisponible: book.cantidadDisponible,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este libro?")) {
      try {
        await api.delete(`/books/${id}`);
        notifications.show({ title: "Éxito", message: "Libro eliminado correctamente", color: "yellow" });
        fetchBooks();
      } catch (error) {
        notifications.show({ title: "Error", message: error.message, color: "red" });
      }
    }
  };

  const rows = books.map((book) => (
    <Table.Tr key={book.idLibro}>
      <Table.Td>{book.titulo}</Table.Td>
      <Table.Td>{book.autor}</Table.Td>
      <Table.Td>{book.isbn}</Table.Td>
      <Table.Td>
        <Badge color={book.estado === "DISPONIBLE" ? "green" : "orange"} variant="light">
          {book.estado}
        </Badge>
      </Table.Td>
      {userRole === "ADMIN" && (
        <Table.Td>
          <Group gap="sm">
            <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(book)}>
              <IconPencil size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(book.idLibro)}>
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
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
            Catálogo de Libros
          </Title> */}
          <Title order={1} ta="center" mb="xl"className={classes.title}> Catálogo de Libros </Title>

          {/* Formulario de CRUD (Solo para Admins) */}
          {userRole === "ADMIN" && (
            <Paper withBorder shadow="md" p="lg" mb="xl" radius="md">
              <Title order={3} mb="md">{isEditing ? "Editar Libro" : "Agregar Nuevo Libro"}</Title>
              <form onSubmit={handleSubmit}>
                <Group grow>
                  <TextInput label="Título" name="titulo" value={formData.titulo} onChange={handleChange} required />
                  <TextInput label="Autor" name="autor" value={formData.autor} onChange={handleChange} required />
                </Group>
                <Group grow mt="md">
                  <TextInput label="ISBN" name="isbn" value={formData.isbn} onChange={handleChange} required />
                  <TextInput label="Género" name="genero" value={formData.genero} onChange={handleChange} required />
                </Group>
                <NumberInput label="Cantidad" name="cantidadDisponible" value={formData.cantidadDisponible} onChange={handleNumberChange} min={0} mt="md" required />
                
                <Group justify="flex-end" mt="xl">
                  {isEditing && (
                    <Button variant="default" onClick={handleCancel}>Cancelar</Button>
                  )}
                  <Button type="submit" loading={loading} color="rgba(71, 47, 22, 1)">
                    {isEditing ? "Guardar Cambios" : "Agregar Libro"}
                  </Button>
                </Group>
              </form>
            </Paper>
          )}

          {/* Tabla de Libros */}
          <Paper withBorder shadow="md" p="lg" radius="md">
            <Title order={3} mb="md">Lista de Libros</Title>
            {books.length > 0 ? (
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Título</Table.Th>
                      <Table.Th>Autor</Table.Th>
                      <Table.Th>ISBN</Table.Th>
                      <Table.Th>Estado</Table.Th>
                      {userRole === "ADMIN" && <Table.Th>Acciones</Table.Th>}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            ) : (
                <Text c="dimmed" ta="center">No hay libros para mostrar.</Text>
            )}
          </Paper>
        </Container>
      </div>
    </MantineProvider>
  );
}