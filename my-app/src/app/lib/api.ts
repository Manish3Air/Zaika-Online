import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
});

export const getCurrentUser = async () => {
  const res = await api.get("/auth/current_user");
  console.log(res.data);
  return res.data || null; // ✅ ensures we return only the user object
};


