"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode, JwtPayload } from "jwt-decode"; // Import JwtPayload

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "customer" | "vendor";
}

// Combine User with standard JWT 'exp' property
interface DecodedToken extends User, JwtPayload {}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let token: string | null = null;

    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      token = urlToken;
      
      localStorage.setItem("zaika_token", urlToken); 
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      token = localStorage.getItem("zaika_token");
    }

    
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);

        const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : false;

        if (isExpired) {
          console.warn("Token expired, logging out.");
          localStorage.removeItem("zaika_token");
          setUser(null);
        } else {
          setUser(decoded);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("zaika_token"); // Clean up bad token
        setUser(null);
      }
    }

    setLoading(false);
  }, []); // Run only once on initial app load

  const logout = () => {
    localStorage.removeItem("zaika_token");
    setUser(null);
    alert("You have been logged out successfully.");
    router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);