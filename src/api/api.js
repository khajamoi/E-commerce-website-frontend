// src/api/api.js
import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // append /api
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("fe_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "https://fruit-ecommerce-backend.onrender.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });


// api.interceptors.request.use(cfg => {
//   const token = localStorage.getItem("fe_token");
//   if (token) cfg.headers.Authorization = `Bearer ${token}`;
//   return cfg;
// });

// export default api;
