// app/store/useAuthStore.ts
import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AuthState {
  username: string | null;
  isLoggedIn: boolean;
  checkAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  isLoggedIn: false,

  checkAuth: () => {
    const user = Cookies.get("username");
    const token = Cookies.get("token");

    console.log("DEBUG: All Cookies:", document.cookie); // This shows everything the browser sees

    if (user) { // Temporarily check only user to see if Navbar stays
      set({ username: user, isLoggedIn: true });
    } else {
      set({ username: null, isLoggedIn: false });
    }
},

  logout: () => {
    Cookies.remove("token", { path: '/' });
    Cookies.remove("username", { path: '/' });
    set({ username: null, isLoggedIn: false });
    window.location.href = "/login";
  }
}));