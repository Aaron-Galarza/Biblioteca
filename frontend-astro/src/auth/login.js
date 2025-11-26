// src/pages/auth/login.js
export async function POST({ request, cookies }) {
  const { email, password } = await request.json();

  try {
    const response = await fetch(`${import.meta.env.BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ message: 'Credenciales inválidas' }), { status: 401 });
    }

    const { token } = await response.json();

    // Guardar el token en una cookie HttpOnly segura
    cookies.set("auth_token", token, {
      httpOnly: true,
      secure: import.meta.env.PROD, // true en producción
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 día
    });

    return new Response(JSON.stringify({ message: "Login exitoso" }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ message: "Error en el servidor" }), { status: 500 });
  }
}