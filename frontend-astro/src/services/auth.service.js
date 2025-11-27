// src/services/auth.service.js
const BASE_URL = import.meta.env.PUBLIC_BACKEND_URL;

export const registerUser = async (data) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message || "Error al registrar.");
  }

  return json;
};

export const loginUser = async (data) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // <-- fundamental
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || result.message || "Error desconocido");
  }

  return result; // { user }
};
