import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const modules = [
    {
      title: "Gestión de Libros",
      description: "Administra el catálogo completo de libros",
      path: "/libros",
      icon: "📚"
    },
    {
      title: "Gestión de Socios", 
      description: "Gestiona información de socios y membresías",
      path: "/socios",
      icon: "👥"
    },
    {
      title: "Control de Préstamos",
      description: "Registra préstamos y devoluciones",
      path: "/prestamos",
      icon: "🔄"
    },
    {
      title: "Administración de Multas",
      description: "Gestiona multas y sanciones",
      path: "/multas",
      icon: "⚖️"
    }
  ];

  return (
    <div className="main-container">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Sistema de Gestión de Biblioteca</h1>
          <p className="page-subtitle">
            Plataforma integral para la administración moderna de bibliotecas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div key={module.title} className="card">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">{module.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <Link to={module.path} className="btn btn-primary">
                  Acceder
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}