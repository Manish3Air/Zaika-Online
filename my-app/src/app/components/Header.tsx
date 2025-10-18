"use client";

import Link from "next/link";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold">Zaika Online</Link>
          <Link href="/restaurants" className="text-sm hover:underline">
            Restaurants
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {!loading && user ? (
            <>
              <Link
                href={user.role === "vendor" ? "/vendor/dashboard" : "#"}
                className="px-3 py-1 border rounded-md"
              >
                {user.name}
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1 bg-blue-600 text-white rounded-md"
            >
              Login with Google
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
