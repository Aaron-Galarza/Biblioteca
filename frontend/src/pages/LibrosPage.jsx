import React, { useEffect, useState, useCallback } from "react";
import api from "../services/Api.js";

export default function LibrosPage() {
  const [libros, setLibros] = useState([]);
  const [formData, setFormData] = useState({ titulo: "", autor: "", isbn: "" });
  const [editando, setEditando] = useState(false);
  const [libroEditado, setLibroEditado] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const mostrarMensaje = useCallback((texto, tipo = "info") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  }, []);

  const cargarLibros = useCallback(async () => {
    try {
      const res = await api.get("libros");
      setLibros(res.data);
    } catch (error) {
      mostrarMensaje("Error al cargar libros", "danger");
      console.error("Error al cargar libros:", error);
    }
  }, [mostrarMensaje]);

  useEffect(() => {
    cargarLibros();
  }, [cargarLibros]);

  const handleChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`libros/${libroEditado.idLibro}`, formData);
        mostrarMensaje("Libro actualizado correctamente", "success");
      } else {
        await api.post("libros", formData);
        mostrarMensaje("Libro agregado correctamente", "success");
      }

      setFormData({ titulo: "", autor: "", isbn: "" });
      setEditando(false);
      setLibroEditado(null);
      cargarLibros();
    } catch (error) {
      const texto = error.response?.data?.error || "Error al guardar el libro";
      mostrarMensaje(texto, "danger");
      console.error("Error en guardar libro:", error);
    }
  }, [editando, libroEditado, formData, mostrarMensaje, cargarLibros]);

  const handleEdit = useCallback((libro) => {
    setEditando(true);
    setLibroEditado(libro);
    setFormData({
      titulo: libro.titulo,
      autor: libro.autor,
      isbn: libro.isbn,
    });
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este libro?")) {
      try {
        await api.delete(`libros/${id}`);
        mostrarMensaje("Libro eliminado correctamente", "warning");
        cargarLibros();
      } catch (error) {
        const texto = error.response?.data?.error || "Error al eliminar el libro";
        mostrarMensaje(texto, "danger");
        console.error("Error al eliminar libro:", error);
      }
    }
  }, [mostrarMensaje, cargarLibros]);

  const handleCancel = useCallback(() => {
    setEditando(false);
    setLibroEditado(null);
    setFormData({ titulo: "", autor: "", isbn: "" });
    mostrarMensaje("Edición cancelada", "secondary");
  }, [mostrarMensaje]);

  return (
    <div className="main-container">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Gestión de Libros</h1>
        </div>

        {mensaje && (
          <div className={`alert alert-${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <div className="card">
          <div className="card-header">
            {editando ? "Editar Libro" : "Agregar Nuevo Libro"}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  name="titulo"
                  className="form-control"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Autor</label>
                <input
                  type="text"
                  name="autor"
                  className="form-control"
                  value={formData.autor}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  className="form-control"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 text-end">
                <button type="submit" className="btn btn-success me-2">
                  {editando ? "Guardar Cambios" : "Agregar Libro"}
                </button>
                {editando && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            Lista de Libros
          </div>
          <div className="card-body">
            {libros.length === 0 ? (
              <p className="text-muted text-center">No hay libros registrados.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Autor</th>
                      <th>ISBN</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {libros.map((libro) => (
                      <tr key={libro.idLibro}>
                        <td>{libro.idLibro}</td>
                        <td>{libro.titulo}</td>
                        <td>{libro.autor}</td>
                        <td>{libro.isbn}</td>
                        <td>
                          <span className={`badge ${libro.estado === "DISPONIBLE" ? "badge-success" : "badge-warning"}`}>
                            {libro.estado}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleEdit(libro)}
                            className="btn btn-sm btn-outline me-2"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(libro.idLibro)}
                            className="btn btn-sm btn-danger"
                          >
                            Eliminar
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
      </div>
    </div>
  );
}