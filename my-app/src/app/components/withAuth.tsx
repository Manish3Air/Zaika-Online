"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

export default function withAuth<P extends object = object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: "vendor" | "customer" | "admin"
) {
  const Protected: React.FC<P> = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace("/");
        } else if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
          router.replace("/");
        }
      }
    }, [user, loading, router, requiredRole]);

    if (
      loading ||
      !user ||
      (requiredRole && user.role !== requiredRole && user.role !== "admin")
    ) {
      return <div className="p-8 text-center">Checking authentication...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  Protected.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return Protected;
}
