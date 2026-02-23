import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7218/api"
});

// 自動帶 Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;