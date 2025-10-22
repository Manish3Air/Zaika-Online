"use client";

import Link from "next/link";
import useAuthContext  from "../hooks/useAuth"; // Assuming this path is correct
import Image from "next/image";

export default function Header() {
  const { user, loading, logout } = useAuthContext();
  
  const profilePic = user?.avatar; 

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and navigation */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Zaika Online
          </Link>
          <Link
            href="/restaurant" 
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Restaurants
          </Link>
        </div>

        {/* User Info / Login */}
        <div className="flex items-center gap-4">
          {loading ? (
            // Show a simple loading skeleton/placeholder
            <div className="h-10 w-40 animate-pulse rounded-md bg-gray-200" />
          ) : user ? (
            // User is loaded and exists
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold overflow-hidden">
                {profilePic ? (
                  <Image
                    src={profilePic}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="object-cover" // Ensures image covers the space
                  />
                ) : (
                  // Fallback to user's initial
                  user.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* Name */}
              <Link
                href={user.role === "vendor" ? "/vendor/dashboard" : "/profile"}
                className="text-gray-700 font-medium hover:underline"
              >
                {user.name}
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            // User is not loaded, and no user exists
            <Link
              href={`${process.env.NEXT_PUBLIC_API_BASE}/auth/google`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Login with Google
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}