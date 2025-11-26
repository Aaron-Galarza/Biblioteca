// src/services/authService.js
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
      throw new Error(errorData.message || 'Ocurrió un error al registrar.');
    }

    return await response.json();

  } catch (error) {
    throw error;
  }
};