// src/components/ReportsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  MantineProvider,
  Container,
  Paper,
  Title,
  Table,
  Badge,
  Text,
  Group,
  Card,
  SimpleGrid,
  ThemeIcon,
  RingProgress,
  Center,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrophy, IconBook, IconChartBar } from "@tabler/icons-react";

import { HeaderMegaMenu } from "./HeaderMegaMenu";
import classes from "../styles/PageLayout.module.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// --- Helper para decodificar JWT (Mismo que tu ejemplo) ---
function decodeJwtPayload(token) {
  if (!token) return null;
  try { return JSON.parse(atob(token.split(".")[1])); }
  catch (e) { return null; }
}

// --- Cliente de API reutilizable (Mismo que tu ejemplo) ---
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
  };
};

const api = createApiClient();

// --- Componente para Tarjeta de Podio ---
const PodiumCard = ({ book, rank }) => {
  if (!book) return null;

  let color = "gray";
  let icon = <IconTrophy size={30} />;
  let label = "Top";

  if (rank === 1) { color = "yellow"; label = "1º Lugar"; }
  else if (rank === 2) { color = "gray.6"; label = "2º Lugar"; }
  else if (rank === 3) { color = "orange.8"; label = "3º Lugar"; }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Badge color={color} variant="filled" size="lg">{label}</Badge>
        <ThemeIcon color={color} variant="light" size="lg" radius="xl">
          {rank <= 3 ? icon : <IconBook />}
        </ThemeIcon>
      </Group>

      <Text fw={700} fz="lg" truncate>{book.titulo}</Text>
      <Text c="dimmed" size="sm" mb="md">{book.autor}</Text>

      <Group justify="center" mt="md">
        <RingProgress
          size={100}
          roundCaps
          thickness={8}
          sections={[{ value: (book.popularidad / 20) * 100, color: color }]} // Asumiendo escala arbitraria para visual
          label={
            <Center>
                <Stack gap={0} align="center">
                    <IconChartBar size={20} />
                    <Text fw={700} size="xl">{book.popularidad}</Text>
                </Stack>
            </Center>
          }
        />
      </Group>
      <Text ta="center" size="xs" c="dimmed" mt="xs">Préstamos Totales</Text>
    </Card>
  );
};

// --- Componente principal ---
export default function ReportsPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Endpoint solicitado
      const data = await api.get("/reports/popular-books");
      
      // Aseguramos orden descendente por popularidad por si el back no lo trae ordenado
      const sortedData = Array.isArray(data) 
        ? data.sort((a, b) => b.popularidad - a.popularidad) 
        : [];
        
      setBooks(sortedData);
    } catch (error) {
      notifications.show({ title: "Error", message: `Error al cargar reporte: ${error.message}`, color: "red" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = decodeJwtPayload(token);
    if (payload) {
      setUser(payload);
      fetchData();
    }
  }, [fetchData]);

  // Generar filas de la tabla
  const rows = books.map((book, index) => {
    const reservesCount = book.colaReservas ? book.colaReservas.length : 0;
    
    return (
        <Table.Tr key={book.idLibro || index}>
        <Table.Td>
            <Badge 
                circle 
                color={index < 3 ? (index === 0 ? "yellow" : index === 1 ? "gray" : "orange") : "blue"}
            >
                {index + 1}
            </Badge>
        </Table.Td>
        <Table.Td fw={500}>{book.titulo}</Table.Td>
        <Table.Td>{book.autor}</Table.Td>
        <Table.Td>{book.genero || 'General'}</Table.Td>
        <Table.Td fw={700} ta="center">{book.popularidad}</Table.Td>
        <Table.Td>
            <Badge color={book.estado === "DISPONIBLE" ? "green" : "red"} variant="light">
            {book.estado}
            </Badge>
        </Table.Td>
        <Table.Td ta="center">
            {reservesCount > 0 ? (
                <Badge color="grape" variant="outline">{reservesCount} en cola</Badge>
            ) : (
                <Text size="sm" c="dimmed">-</Text>
            )}
        </Table.Td>
        </Table.Tr>
    );
  });

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <HeaderMegaMenu />
      <div className={classes.wrapper}>
        <Container size="lg" my="xl">
          <Title order={1} ta="center" mb="xl" className={classes.title}>
             Reporte de Popularidad 
          </Title>

          {/* Sección de Podio (Top 3) */}
          {books.length > 0 && (
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb={40}>
                {books[1] && <PodiumCard book={books[1]} rank={2} />} {/* Plata - Izquierda */}
                {books[0] && <PodiumCard book={books[0]} rank={1} />} {/* Oro - Centro */}
                {books[2] && <PodiumCard book={books[2]} rank={3} />} {/* Bronce - Derecha */}
            </SimpleGrid>
          )}

          {/* Tabla Detallada */}
          <Paper withBorder shadow="md" p="lg" radius="md">
            <Group justify="space-between" mb="md">
                <Title order={3}>Ranking Completo</Title>
                <Badge variant="outline" size="lg">Total Libros: {books.length}</Badge>
            </Group>
            
            <Table striped highlightOnHover withTableBorder stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Título</Table.Th>
                  <Table.Th>Autor</Table.Th>
                  <Table.Th>Género</Table.Th>
                  <Table.Th ta="center">Popularidad</Table.Th>
                  <Table.Th>Estado Actual</Table.Th>
                  <Table.Th ta="center">Reservas</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                    <Table.Tr><Table.Td colSpan={7} ta="center">Cargando datos...</Table.Td></Table.Tr>
                ) : rows.length > 0 ? (
                    rows
                ) : (
                    <Table.Tr><Table.Td colSpan={7} ta="center">No hay datos disponibles.</Table.Td></Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Paper>
        </Container>
      </div>
    </MantineProvider>
  );
}