import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",   // 统一指向后端
  withCredentials: true,                   // 携带 cookie（和后端 Session/Token 配合）
  headers: { "Content-Type": "application/json" },
});

// 如果未来要加 Bearer Token，可以打开：
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;
