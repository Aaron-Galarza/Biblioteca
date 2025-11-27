// src/services/auth.service.js
const BASE_URL = import.meta.env.PUBLIC_BACKEND_URL;

export const registerUser = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const err = new Error(errorData.message || 'Ocurrió un error al registrar.');
      err.status = response.status;
      throw err;
    }

    return await response.json();

  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data) => {
  console.log(data)
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || result.message || "Error desconocido");
  }

  return result;
};
