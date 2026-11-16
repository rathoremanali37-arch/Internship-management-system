import { createContext, useContext, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("internhub_session")) || null; }
    catch { return null; }
  });
  async function login(credentials) {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("internhub_session", JSON.stringify(data));
    setSession(data);
    return data;
  }
  async function register(details) {
    const { data } = await api.post("/auth/register", details);
    localStorage.setItem("internhub_session", JSON.stringify(data));
    setSession(data);
    return data;
  }
  function logout() { localStorage.removeItem("internhub_session"); setSession(null); }
  const value = useMemo(() => ({ user: session?.user || null, token: session?.token || null, login, register, logout }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
