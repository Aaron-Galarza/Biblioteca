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
      const resp = await fetch(`${import.meta.env.PUBLIC_BACKEND_URL}/auth/profile`, {
        credentials: "include",  // <-- importante
      });

      if (resp.ok) {
        const user = await resp.json();
        context.locals.user = user;
      } else {
        cookies.delete("auth_token", { path: "/" });
      }
    } catch {
      cookies.delete("auth_token", { path: "/" });
    }
  }

  const user = context.locals.user;
  const currentPath = url.pathname;

  if (protectedRoutes.some(r => currentPath === r || currentPath.startsWith(`${r}/`)) && !user) {
    return redirect("/login");
  }

  if (adminRoutes.some(r => currentPath === r || currentPath.startsWith(`${r}/`)) && user?.role !== 'ADMIN') {
    return redirect("/");
  }

  return next();
});
