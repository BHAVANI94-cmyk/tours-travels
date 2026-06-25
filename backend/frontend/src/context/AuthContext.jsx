import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("tourismUser");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const register = async ({ name, email, password, role }) => {
    const data = await authAPI.register({ name, email, password, role });
    const userData = { ...data.user, token: data.token };
    localStorage.setItem("tourismUser", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const login = async ({ email, password }) => {
    const data = await authAPI.login({ email, password });
    const userData = { ...data.user, token: data.token };
    localStorage.setItem("tourismUser", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // Fallback: local-only login (if backend not running yet)
  const loginLocal = (userData) => {
    localStorage.setItem("tourismUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("tourismUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginLocal, logout, isLoggedIn: !!user, role: user?.role }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
