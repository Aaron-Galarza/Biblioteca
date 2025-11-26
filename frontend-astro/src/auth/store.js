// src/pages/auth/store.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (userData) => set({ user: userData, isLoggedIn: !!userData }),
}));