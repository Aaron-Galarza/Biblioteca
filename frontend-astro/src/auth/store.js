// src/pages/auth/store.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (userData) => {
    set({
      user: userData || null,
      isLoggedIn: !!userData,
    });
  },

  clearUser: () => {
    set({ user: null, isLoggedIn: false });
  },

  // helper cliente para cerrar sesión (invoca backend /logout si lo tenés)
  logout: async () => {
    try {
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      // ignore (mejor mostrar notificación en producción)
      console.error('logout error', err);
    } finally {
      set({ user: null, isLoggedIn: false });
      // redirigir al login
      window.location.href = '/login';
    }
  },
}));
