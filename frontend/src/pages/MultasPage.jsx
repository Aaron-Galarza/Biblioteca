import React, { useEffect, useState, useCallback } from "react";
import api from "../services/Api.js";

export default function MultasPage() {
  const [multas, setMultas] = useState([]);
  const [socios, setSocios] = useState([]);
  const [formData, setFormData] = useState({
    idSocio: "",
    motivo: "",
    monto: "",
    fecha: "",
  });
  const [mensaje, setMensaje] = useState(null);

  const mostrarMensaje = useCallback((texto, tipo = "info") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  }, []);

  const cargarDatos = useCallback(async () => {
    try {
      const resSocios = await api.get("socios");
      setSocios(resSocios.data);
      try {
        const resMultas = await api.get("multas");
        setMultas(resMultas.data);
      } catch (errMultas) {
        console.warn("No se pudieron cargar multas:", errMultas);
        setMultas([]);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await api.post("multas", formData);
      mostrarMensaje("Multa registrada correctamente ✅", "success");
      setFormData({ idSocio: "", motivo: "", monto: "", fecha: "" });
      cargarDatos();
    } catch (error) {
      const texto = error.response?.data?.error || "Error al registrar la multa";
      mostrarMensaje(texto, "danger");
      console.error(error);
    }
  }, [formData, mostrarMensaje, cargarDatos]);

  const cancelarMulta = useCallback(async (idMulta) => {
    if (window.confirm("¿Confirmar cancelación de esta multa?")) {
      try {
        await api.put(`multas/${idMulta}/cancelar`);
        mostrarMensaje("Multa cancelada correctamente 🟢", "success");
        cargarDatos();
      } catch (error) {
        const texto = error.response?.data?.error || "Error al cancelar la multa";
        mostrarMensaje(texto, "danger");
        console.error(error);
      }
    }
  }, [mostrarMensaje, cargarDatos]);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">⚠️ Gestión de Multas</h2>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} text-center fw-semibold`}>
          {mensaje.texto}
        </div>
      )}

      <div className="card shadow p-4 mb-4">
        <h5 className="mb-3">Registrar Nueva Multa</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Socio</label>
            <select
              name="idSocio"
              className="form-select"
              value={formData.idSocio}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un socio...</option>
              {socios.map((s) => (
                <option key={s.idSocio} value={s.idSocio}>
                  {s.nombre} ({s.numeroSocio})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Motivo</label>
            <input
              type="text"
              name="motivo"
              className="form-control"
              value={formData.motivo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Monto</label>
            <input
              type="number"
              name="monto"
              className="form-control"
              value={formData.monto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              name="fecha"
              className="form-control"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-success">
              Registrar Multa
            </button>
          </div>
        </form>
      </div>

      <div className="card shadow p-4">
        <h5 className="mb-3">📋 Lista de Multas Activas</h5>
        {multas.length === 0 ? (
          <p className="text-muted">No hay multas activas.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-danger">
                <tr>
                  <th>ID</th>
                  <th>Socio</th>
                  <th>Motivo</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {multas.map((m) => (
                  <tr key={m.idMulta}>
                    <td>{m.idMulta}</td>
                    <td>{m.Socio?.nombre}</td>
                    <td>{m.motivo}</td>
                    <td>${parseFloat(m.monto).toFixed(2)}</td>
                    <td>{m.fecha}</td>
                    <td>
                      <span
                        className={
                          m.estado === "ACTIVA"
                            ? "badge bg-warning text-dark"
                            : "badge bg-success"
                        }
                      >
                        {m.estado}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => cancelarMulta(m.idMulta)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Cancelar Multa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}