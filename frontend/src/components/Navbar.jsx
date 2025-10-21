import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  return (
    <nav className="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Biblioteca Municipal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/libros">
                Libros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/socios">
                Socios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/prestamos">
                Préstamos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/multas">
                Multas
              </NavLink>
            </li>
            {!isHomePage && (
              <li className="nav-item">
                <NavLink className="nav-link text-warning" to="/">
                  Salir
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}