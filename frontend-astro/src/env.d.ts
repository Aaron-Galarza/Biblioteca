// src/env.d.ts

/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: {
      id: string; // O el tipo que corresponda (number, etc.)
      name: string;
      email: string;
      role: 'USER' | 'ADMIN'; // Sé específico con los roles
      // ...cualquier otra propiedad que devuelva tu backend en /auth/profile
    } | null; // Importante: puede ser `null` si el usuario no está logueado
  }
}