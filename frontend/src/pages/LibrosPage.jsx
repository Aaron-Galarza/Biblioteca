import React, { useEffect, useState } from "react";
import api from ".../services/api";

export default function LibrosPage() {
  const [libros, setLibros] = useState([]);
  const [formData, setFormData] = useState({ titulo: "", autor: "", isbn: "" });
  const [editando, setEditando] = useState(false);
  const [libroEditado, setLibroEditado] = useState(null);

  // Cargar libros al iniciar
  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    try {
      const res = await api.get("libros");
      setLibros(res.data);
    } catch (error) {
      console.error("Error al cargar libros:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await api.put(`libros/${libroEditado.idLibro}`, formData);
      } else {
        await api.post("libros", formData);
      }

      setFormData({ titulo: "", autor: "", isbn: "" });
      setEditando(false);
      setLibroEditado(null);
      cargarLibros();
    } catch (error) {
      alert("Error al guardar el libro");
      console.error(error);
    }
  };

  const handleEdit = (libro) => {
    setEditando(true);
    setLibroEditado(libro);
    setFormData({
      titulo: libro.titulo,
      autor: libro.autor,
      isbn: libro.isbn,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este libro?")) {
      try {
        await api.delete(`libros/${id}`);
        cargarLibros();
      } catch (error) {
        alert("Error al eliminar el libro");
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setEditando(false);
    setLibroEditado(null);
    setFormData({ titulo: "", autor: "", isbn: "" });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">📚 Gestión de Libros</h2>

      {/* Formulario */}
      <div className="card shadow p-4 mb-4">
        <h5 className="mb-3">
          {editando ? "✏️ Editar Libro" : "➕ Agregar Nuevo Libro"}
        </h5>
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

      {/* Listado */}
      <div className="card shadow p-4">
        <h5 className="mb-3">📖 Lista de Libros</h5>
        {libros.length === 0 ? (
          <p className="text-muted">No hay libros registrados.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-primary">
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
                      <span
                        className={
                          libro.estado === "DISPONIBLE"
                            ? "badge bg-success"
                            : "badge bg-warning text-dark"
                        }
                      >
                        {libro.estado}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(libro)}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(libro.idLibro)}
                        className="btn btn-sm btn-outline-danger"
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
  );
}