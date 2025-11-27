// src/components/ActiveMembersPage.jsx
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
  Avatar,
  Stack,
  ThemeIcon,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconUserStar, IconMedal, IconPhone, IconMail } from "@tabler/icons-react";

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
  };
};

const api = createApiClient();

// --- Helper para obtener iniciales ---
const getInitials = (name) => {
  if (!name) return "NN";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

// --- Componente para Tarjeta de Podio de Socios ---
const MemberCard = ({ member, rank }) => {
  if (!member) return null;

  let color = "blue";
  let medalColor = "gray";
  let label = "Top";

  if (rank === 1) { color = "yellow"; medalColor = "yellow"; label = "1º Puesto"; }
  else if (rank === 2) { color = "gray"; medalColor = "gray.5"; label = "2º Puesto"; }
  else if (rank === 3) { color = "orange"; medalColor = "orange.7"; label = "3º Puesto"; }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="xs">
            <Badge color={color} variant="light" size="lg" mb="xs">{label}</Badge>
            
            <Avatar size={80} radius="xl" color={color} variant="filled">
                {getInitials(member.nombre)}
            </Avatar>
            
            <Text fw={700} fz="lg" ta="center" truncate w="100%">{member.nombre}</Text>
            <Text c="dimmed" size="xs">Socio #{member.numeroSocio}</Text>

            <Group gap={5} mt="sm">
                <IconMedal color="var(--mantine-color-blue-6)" size={20} />
                <Text fw={700} size="xl">{member.totalPrestamos}</Text>
                <Text size="sm" c="dimmed">préstamos</Text>
            </Group>
        </Stack>
    </Card>
  );
};

// --- Componente principal ---
export default function ActiveMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Consumir el endpoint de reportes
      const data = await api.get("/reports/active-members");
      
      // Ordenar descendente por totalPrestamos para asegurar el ranking correcto
      const sortedData = Array.isArray(data) 
        ? data.sort((a, b) => b.totalPrestamos - a.totalPrestamos) 
        : [];
        
      setMembers(sortedData);
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

  // Filas de la tabla
  const rows = members.map((member, index) => (
    <Table.Tr key={member.idSocio || index}>
      <Table.Td>
        <Group gap="sm">
            <Text fw={700} c="dimmed">#{index + 1}</Text>
            <Avatar size={30} radius="xl" color="blue" variant="light">
                {getInitials(member.nombre)}
            </Avatar>
        </Group>
      </Table.Td>
      <Table.Td fw={500}>{member.nombre}</Table.Td>
      <Table.Td>
        <Badge variant="outline" color="gray">{member.numeroSocio}</Badge>
      </Table.Td>
      <Table.Td>{member.dni}</Table.Td>
      <Table.Td>
        <Stack gap={2}>
            {member.email && (
                <Group gap={5}>
                    <IconMail size={14} color="gray" />
                    <Text size="xs">{member.email}</Text>
                </Group>
            )}
            {member.telefono && (
                <Group gap={5}>
                    <IconPhone size={14} color="gray" />
                    <Text size="xs">{member.telefono}</Text>
                </Group>
            )}
        </Stack>
      </Table.Td>
      <Table.Td fw={700} ta="center" c="blue">
        {member.totalPrestamos}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <HeaderMegaMenu />
      <div className={classes.wrapper}>
        <Container size="lg" my="xl">
          <Title order={1} ta="center" mb="xl" className={classes.title}>
             Socios Más Activos 
          </Title>

          {/* Podio Visual (Top 3) */}
          {members.length > 0 && (
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb={40}>
                {members[1] && <MemberCard member={members[1]} rank={2} />} {/* Plata - Izquierda */}
                {members[0] && <MemberCard member={members[0]} rank={1} />} {/* Oro - Centro */}
                {members[2] && <MemberCard member={members[2]} rank={3} />} {/* Bronce - Derecha */}
            </SimpleGrid>
          )}

          {/* Tabla Detallada */}
          <Paper withBorder shadow="md" p="lg" radius="md">
            <Group justify="space-between" mb="md">
                <Group>
                    <IconUserStar size={24} />
                    <Title order={3}>Ranking de Lectores</Title>
                </Group>
                <Badge variant="filled" size="lg" color="rgba(71, 47, 22, 1)">
                    Total Socios Activos: {members.length}
                </Badge>
            </Group>
            
            <Table striped highlightOnHover withTableBorder stickyHeader verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Rango</Table.Th>
                  <Table.Th>Nombre Completo</Table.Th>
                  <Table.Th>N° Socio</Table.Th>
                  <Table.Th>DNI</Table.Th>
                  <Table.Th>Contacto</Table.Th>
                  <Table.Th ta="center">Préstamos Realizados</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                    <Table.Tr><Table.Td colSpan={6} ta="center">Cargando datos...</Table.Td></Table.Tr>
                ) : rows.length > 0 ? (
                    rows
                ) : (
                    <Table.Tr><Table.Td colSpan={6} ta="center">No hay registros de actividad.</Table.Td></Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Paper>
        </Container>
      </div>
    </MantineProvider>
  );
}