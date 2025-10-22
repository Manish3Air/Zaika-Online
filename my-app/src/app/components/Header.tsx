"use client";

import { useState } from "react";
import Link from "next/link";
import  useAuthContext  from "../hooks/useAuth"; // Assuming this path is correct
import Image from "next/image";

// SVG for the hamburger menu icon
const HamburgerIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

// SVG for the close (X) icon
const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function Header() {
  const { user, loading, logout } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profilePic = user?.avatar;

  // Define the Google login URLs based on the desired role
  const apiBase = process.env.NEXT_PUBLIC_API_BASE;
  const customerLoginUrl = `${apiBase}/auth/google?role=customer`;
  const vendorLoginUrl = `${apiBase}/auth/google?role=vendor`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Desktop Navigation */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800"
            onClick={() => setIsMobileMenuOpen(false)} // Close menu on logo click
          >
            Zaika Online
          </Link>
          <Link
            href="/restaurants"
            className="text-gray-600 hover:text-gray-800 transition-colors hidden md:block"
          >
            Restaurants
          </Link>
        </div>

        {/* Desktop User Info / Login Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="h-10 w-48 animate-pulse rounded-md bg-gray-200" />
          ) : user ? (
            // User is logged in
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold overflow-hidden">
                {profilePic ? (
                  <Image
                    src={profilePic}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <Link
                href={user.role === "vendor" ? "/vendor/dashboard" : "/profile"}
                className="text-gray-700 font-medium hover:underline"
              >
                {user.name}
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            // User is logged out
            <div className="flex items-center gap-2">
              <Link
                href={vendorLoginUrl}
                className="px-4 py-2 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
              >
                Sell on Zaika
              </Link>
              <Link
                href={customerLoginUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-y-0"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
      >
        <nav className="flex flex-col space-y-4">
          <Link
            href="/restaurants"
            className="text-gray-700 hover:text-blue-600"
          >
            Restaurants
          </Link>

          {/* Mobile Auth Section */}
          {loading ? (
            <div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />
          ) : user ? (
            // Logged in (Mobile)
            <div className="pt-4 border-t border-gray-200">
              <Link
                href={user.role === "vendor" ? "/vendor/dashboard" : "/profile"}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold overflow-hidden">
                  {profilePic ? (
                    <Image
                      src={profilePic}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="font-medium text-gray-800">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 bg-red-50 text-red-600 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            // Logged out (Mobile)
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
              <Link
                href={vendorLoginUrl}
                className="w-full px-4 py-2 text-center text-blue-600 font-medium rounded-md bg-blue-50"
              >
                Sell on Zaika
              </Link>
              <Link
                href={customerLoginUrl}
                className="w-full px-4 py-2 text-center bg-blue-600 text-white rounded-md"
              >
                Login
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
