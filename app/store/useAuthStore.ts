import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AuthState {
  username: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  email: string | null;
  checkAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  isLoggedIn: false,
  isAdmin: false,
  email: null,

  checkAuth: () => {
    // 1. Read all values from browser cookies
    const user = Cookies.get("username");
    const token = Cookies.get("token");
    const adminFlag = Cookies.get("is_admin");
    const userEmail = Cookies.get("email"); // Added email cookie retrieval

    // 2. Comprehensive Debug Console Table
    console.log("%c--- AUTH STORE SYNC ---", "color: #5D5FEF; font-weight: bold;");
    console.table({
      Username: user || "Not Found",
      Email: userEmail || "Not Found",
      IsAdmin: adminFlag || "false",
      TokenStatus: token ? "✅ Valid" : "❌ Missing",
    });

    // 3. Sync state if core credentials exist
    if (token && user) {
      set({ 
        username: user, 
        email: userEmail || null, // Syncing email to state
        isLoggedIn: true, 
        isAdmin: String(adminFlag).toLowerCase() === "true"
      });
    } else {
      // Clear state if token/user missing
      set({ username: null, email: null, isLoggedIn: false, isAdmin: false });
    }
  },

  logout: () => {
    console.log("DEBUG: Logging out and clearing all session data...");

    // 1. Standard removal via js-cookie
    const cookieOptions = { path: '/' };
    Cookies.remove("token", cookieOptions);
    Cookies.remove("username", cookieOptions);
    Cookies.remove("is_admin", cookieOptions);
    Cookies.remove("email", cookieOptions); // Added email cleanup

    // 2. Manual "Nuke" for older browsers/stricter paths
    const pastDate = "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = `token=; path=/; ${pastDate}`;
    document.cookie = `username=; path=/; ${pastDate}`;
    document.cookie = `is_admin=; path=/; ${pastDate}`;
    document.cookie = `email=; path=/; ${pastDate}`; // Added email cleanup

    // 3. Clear LocalStorage (as we used this for Admin Fetch earlier)
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");

    // 4. Reset Zustand State
    set({ username: null, email: null, isLoggedIn: false, isAdmin: false });

    // 5. Force a clean redirect
    window.location.replace("/login");
  }
}));