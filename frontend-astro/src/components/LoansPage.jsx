// src/components/LoansPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  MantineProvider,
  Container,
  Paper,
  Title,
  Button,
  Group,
  Table,
  Badge,
  ActionIcon,
  Text,
  Select,
  Tooltip,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconBookUpload, IconClockPlus } from "@tabler/icons-react";

import { HeaderMegaMenu } from "./HeaderMegaMenu";
import classes from "../styles/PageLayout.module.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import '@mantine/dates/styles.css';

// --- Helper: Decodificar JWT ---
function decodeJwtPayload(token) {
  if (!token) return null;
  try { return JSON.parse(atob(token.split(".")[1])); }
  catch (e) { return null; }
}

// --- Helper: Formatear fecha a YYYY-MM-DD (Evita problemas de zona horaria) ---
const formatDateToBackend = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- Helper: Formatear fecha para mostrar en tabla (DD/MM/YYYY) ---
// El backend a veces devuelve fecha completa ISO o solo YYYY-MM-DD. Esto maneja ambos.
// const formatDateForDisplay = (dateString) => {
//     if (!dateString) return "-";
//     // Si viene como "2023-11-27", simplemente spliteamos
//     // if (dateString.includes('T')) {
//     //     return new Date(dateString).toLocaleDateString();
//     // }
//     // const [year, month, day] = dateString.split('-');
//     return `${day}/${month}/${year}`;
// };

// --- Cliente API ---
const createApiClient = () => {
  const BASE_URL = import.meta.env.PUBLIC_BACKEND_URL;
  const getToken = () => localStorage.getItem("token");

  const request = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || "Error desconocido en el servidor");
    }
    const contentType = response.headers.get("content-type");
    return contentType?.includes("application/json") ? response.json() : {};
  };

  return {
    get: (endpoint) => request(endpoint),
    post: (endpoint, body) => request(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: (endpoint, body) => request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  };
};

const api = createApiClient();

// --- Componente Principal ---
export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [socios, setSocios] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    idSocio: "",
    idLibro: "",
    fechaInicio: new Date(),
    fechaDevolucion: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Carga de datos
  const fetchData = useCallback(async (currentUser) => {
    try {
      if (currentUser.role === "ADMIN") {
        // Obtenemos préstamos, socios y libros
        const [loansData, sociosData, booksData] = await Promise.all([
          api.get("/loans"),    // Endpoint que usa obtenerPrestamos
          api.get("/partners"),   // Endpoint de socios (ajustar si es /partners)
          api.get("/books"),    // Endpoint de libros
        ]);
        
        setLoans(loansData);
        setSocios(sociosData);
        // Filtramos solo libros disponibles para el select
        setAvailableBooks(booksData.filter(book => book.estado === 'DISPONIBLE'));
      } else {
        // Vista para socio normal
        const loansData = await api.get(`/loans/socio/${currentUser.idSocio}`);
        setLoans(loansData);
      }
    } catch (error) {
      notifications.show({ title: "Error de carga", message: error.message, color: "red" });
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

  const resetForm = () => {
    setFormData({ idSocio: "", idLibro: "", fechaInicio: new Date(), fechaDevolucion: null });
  };

  // --- REGISTRAR PRÉSTAMO ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.idSocio || !formData.idLibro || !formData.fechaDevolucion) {
        notifications.show({ title: "Datos incompletos", message: "Todos los campos son obligatorios.", color: "yellow" });
        return;
    }

    setLoading(true);
    try {
      // PREPARAR PAYLOAD: Convertir fechas a String YYYY-MM-DD
      const payload = {
        idSocio: formData.idSocio,
        idLibro: formData.idLibro,
        fechaInicio: formatDateToBackend(formData.fechaInicio),
        fechaDevolucion: formatDateToBackend(formData.fechaDevolucion),
      };

      console.log("Enviando Payload:", payload); // Debug

      await api.post("/loans", payload);
      
      notifications.show({ title: "Préstamo Creado", message: "El préstamo se registró correctamente.", color: "green" });
      resetForm();
      fetchData(user); // Recargar para actualizar tabla y quitar libro de disponibles
    } catch (error) {
      notifications.show({ title: "Error al registrar", message: error.message, color: "red" });
    } finally {
      setLoading(false);
    }
  };

  // --- DEVOLVER LIBRO ---
  const handleReturnLoan = async (id) => {
    if (window.confirm("¿Confirmas la recepción del libro?")) {
      try {
        await api.put(`/loans/${id}/return`); // Endpoint mapeado a cerrarPrestamo
        notifications.show({ title: "Devolución Exitosa", message: "Libro marcado como disponible.", color: "blue" });
        fetchData(user);
      } catch (error) {
        notifications.show({ title: "Error", message: error.message, color: "red" });
      }
    }
  };

  // --- EXTENDER PRÉSTAMO (Bonus por tu backend code) ---
  const handleExtendLoan = async (id) => {
      try {
        await api.put(`/loans/${id}/extend`); // Asumiendo endpoint mapeado a extenderPrestamo
        notifications.show({ title: "Préstamo Extendido", message: "Se han sumado 5 días al vencimiento.", color: "grape" });
        fetchData(user);
      } catch (error) {
        notifications.show({ title: "No se pudo extender", message: error.message, color: "orange" });
      }
  };

  // Opciones para selects
  const sociosOptions = (socios || []).map(s => ({ 
    value: s.idSocio, 
    label: `${s.nombre} (DNI: ${s.dni || 'S/D'})` 
  }));
  
  const booksOptions = (availableBooks || []).map(b => ({ 
    value: b.idLibro, 
    label: `${b.titulo} - ${b.autor}` 
  }));

  // Generación de Filas
  const rows = loans.map((loan) => (
    <Table.Tr key={loan.idPrestamo}>
      {/* Usamos Optional Chaining (?.) y los nombres correctos del backend (Socio, Libro con mayúscula) */}
      {user?.role === "ADMIN" && <Table.Td>{loan.Socio?.nombre || 'Usuario Eliminado'}</Table.Td>}
      <Table.Td>{loan.Libro?.titulo || 'Libro Eliminado'}</Table.Td>
      
      {/* <Table.Td>{formatDateForDisplay(loan.fechaInicio)}</Table.Td>
      <Table.Td>{formatDateForDisplay(loan.fechaDevolucion)}</Table.Td> */}
      
      {/* Campo correcto backend: estadoPrestamo */}
      <Table.Td>
        <Badge 
            color={loan.estadoPrestamo === "ACTIVO" ? "green" : "gray"} 
            variant="light"
        >
          {loan.estadoPrestamo}
        </Badge>
        {loan.conteoExtensiones > 0 && (
             <Badge size="xs" circle color="grape" ml={5}>{loan.conteoExtensiones}</Badge>
        )}
      </Table.Td>
      
      {user?.role === "ADMIN" && (
        <Table.Td>
          <Group gap={5}>
            {loan.estadoPrestamo === "ACTIVO" && (
                <>
                    <Tooltip label="Registrar Devolución">
                        <ActionIcon variant="light" color="blue" onClick={() => handleReturnLoan(loan.idPrestamo)}>
                            <IconBookUpload size={18} />
                        </ActionIcon>
                    </Tooltip>
                    
                    {/* Solo mostrar extender si no superó limite, según backend */}
                    {(loan.conteoExtensiones || 0) < 1 && (
                        <Tooltip label="Extender 5 días">
                            <ActionIcon variant="light" color="grape" onClick={() => handleExtendLoan(loan.idPrestamo)}>
                                <IconClockPlus size={18} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                </>
            )}
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
          <Title order={1} ta="center" mb="xl" className={classes.title}> Gestión de Préstamos </Title>

          {user?.role === "ADMIN" && (
            <Paper withBorder shadow="md" p="lg" mb="xl" radius="md">
              <Title order={3} mb="md">Registrar Nuevo Préstamo</Title>
              <form onSubmit={handleSubmit}>
                <Group grow>
                  <Select 
                    label="Seleccionar Socio" 
                    placeholder="Busca por nombre..." 
                    data={sociosOptions} 
                    value={formData.idSocio} 
                    onChange={(v) => handleChange('idSocio', v)} 
                    searchable 
                    nothingFoundMessage="No hay socios registrados"
                    required 
                  />
                  <Select 
                    label="Seleccionar Libro" 
                    placeholder="Solo libros disponibles..." 
                    data={booksOptions} 
                    value={formData.idLibro} 
                    onChange={(v) => handleChange('idLibro', v)} 
                    searchable 
                    nothingFoundMessage="No hay libros disponibles ahora"
                    required 
                  />
                </Group>
                <Group grow mt="md">
                  <DateInput 
                    label="Fecha de Inicio" 
                    value={formData.fechaInicio} 
                    valueFormat="DD/MM/YYYY"
                    disabled 
                  />
                  <DateInput 
                    label="Fecha de Devolución" 
                    placeholder="Selecciona fecha..." 
                    value={formData.fechaDevolucion} 
                    onChange={(d) => handleChange('fechaDevolucion', d)} 
                    valueFormat="DD/MM/YYYY" 
                    minDate={new Date()} // No permitir fechas pasadas
                    required 
                  />
                </Group>
                <Group justify="flex-end" mt="xl">
                  <Button type="submit" loading={loading} color="rgba(71, 47, 22, 1)">
                    Confirmar Préstamo
                  </Button>
                </Group>
              </form>
            </Paper>
          )}

          <Paper withBorder shadow="md" p="lg" radius="md">
            <Group justify="space-between" mb="md">
                <Title order={3}>Préstamos Activos</Title>
                <Badge variant="outline" size="lg">Total: {loans.length}</Badge>
            </Group>
            
            {loans.length > 0 ? (
              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    {user?.role === "ADMIN" && <Table.Th>Socio</Table.Th>}
                    <Table.Th>Libro</Table.Th>
                    <Table.Th>Inicio</Table.Th>
                    <Table.Th>Vencimiento</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    {user?.role === "ADMIN" && <Table.Th>Acciones</Table.Th>}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            ) : (
              <Text c="dimmed" ta="center" py="xl">No hay préstamos activos en este momento.</Text>
            )}
          </Paper>
        </Container>
      </div>
    </MantineProvider>
  );
}