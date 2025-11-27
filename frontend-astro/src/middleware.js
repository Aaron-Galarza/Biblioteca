// src/auth.middleware.js
import { defineMiddleware } from "astro:middleware";

const protectedRoutes = ["/bookings", "/loans", "/fines", "/notifications"];
const adminRoutes = ["/dashboard"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const token = cookies.get("auth_token")?.value;

  context.locals.user = null;

  if (token) {
    try {
      const resp = await fetch(`${import.meta.env.BACKEND_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (resp.ok) {
        const user = await resp.json();
        context.locals.user = user;
      } else {
        // token inválido -> eliminar cookie
        cookies.delete("auth_token", { path: "/" });
        context.locals.user = null;
      }
    } catch (err) {
      console.error('Token verification failed', err);
      context.locals.user = null;
    }
  }

  const user = context.locals.user;
  const currentPath = url.pathname;

  // proteger rutas que empiezan con alguno de los protegidos
  if (protectedRoutes.some(r => currentPath === r || currentPath.startsWith(`${r}/`)) && !user) {
    return redirect("/login");
  }

  if (adminRoutes.some(r => currentPath === r || currentPath.startsWith(`${r}/`)) && user?.role !== 'ADMIN') {
    return redirect("/");
  }

  return next();
});
