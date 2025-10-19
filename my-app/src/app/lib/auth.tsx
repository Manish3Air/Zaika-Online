"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "./api";
import { useRouter } from "next/navigation";

interface User {
  _id: string; // <-- Changed from 'id' to '_id' for consistency with MongoDB
  name: string;
  email: string;
  role: "customer" | "vendor";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
      
      // 1. Update the local state immediately
      setUser(null); // <-- CRITICAL FIX: Update the state
      
      // 2. Then, handle redirection and alerts
      alert('You have been logged out successfully.');
      router.push('/');
      router.refresh(); 

    } catch (error) {
      console.error('Logout failed:', error);
      alert('There was an issue logging out. Please try again.');
    }
  }; 

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);