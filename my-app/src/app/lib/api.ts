import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "/api",
  withCredentials: true,
});

export const getCurrentUser = () => api.get("/current_user").then((r) => r.data);
export const logoutUser = () => api.post("/logout");
