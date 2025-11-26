// src/pages/auth/logout.js
export async function POST({ cookies }) {
  cookies.delete("auth_token", { path: "/" });
  return new Response(JSON.stringify({ message: "Logout exitoso" }), { status: 200 });
}