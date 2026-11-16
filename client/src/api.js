import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
api.interceptors.request.use((config) => {
  try { const session = JSON.parse(localStorage.getItem("internhub_session")); if (session?.token) config.headers.Authorization = `Bearer ${session.token}`; } catch {}
  return config;
});
export default api;
