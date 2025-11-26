// src/middleware/auth.middleware.js

import { defineMiddleware } from "astro:middleware";

const protectedRoutes = ["/bookings", "/loans", "/fines", "/notifications"];
const adminRoutes = ["/dashboard"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const token = cookies.get("auth_token")?.value;

  if (token) {
    try {
      const response = await fetch(`${import.meta.env.BACKEND_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const user = await response.json();
        context.locals.user = user;
      } else {
        cookies.delete("auth_token", { path: "/" });
        context.locals.user = null;
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      context.locals.user = null;
    }
  } else {
    context.locals.user = null;
  }

  const user = context.locals.user;
  const currentPath = url.pathname;

  if (protectedRoutes.some(route => currentPath.startsWith(route)) && !user) {
    return redirect("/login");
  }

  if (adminRoutes.some(route => currentPath.startsWith(route)) && user?.role !== 'ADMIN') {
    return redirect("/");
  }

  return next();
});