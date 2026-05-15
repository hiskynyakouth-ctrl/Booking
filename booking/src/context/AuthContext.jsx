import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data.user);
          localStorage.setItem("mock_me", JSON.stringify(res.data.user));
        } catch {
          try {
            const stored = localStorage.getItem("mock_me");
            if (stored) setUser(JSON.parse(stored));
          } catch {}
        }
      } else {
        try {
          const stored = localStorage.getItem("mock_me");
          if (stored) setUser(JSON.parse(stored));
        } catch {}
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("mock_me", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mock_me");
    localStorage.removeItem("token");
  };

  const isAdmin    = user?.role === "admin";
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
