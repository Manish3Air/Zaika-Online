"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

export default function withAuth<P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: "vendor" | "customer"
) {
  const Protected: React.FC<P> = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace("/");
        } 
        //else if (requiredRole && user.role !== requiredRole) {
        //   router.replace("/");
        // }
      }
    }, [user, loading, router, requiredRole]);

    if (loading || !user) {
      return <div className="p-8 text-center">Checking authentication...</div>;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  Protected.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return Protected;
}
