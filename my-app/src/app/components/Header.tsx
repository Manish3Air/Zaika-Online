"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import useAuthContext from "../hooks/useAuth";
import Image from "next/image";

export default function Header() {
  const { user, loading, logout } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const profilePic = user?.avatar;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE;
  const customerLoginUrl = `${apiBase}/auth/google?role=customer`;
  const vendorLoginUrl = `${apiBase}/auth/google?role=vendor`;

  // ✅ Close dropdown when clicked outside
  useEffect(() => {
    interface ClickOutsideEventHandler {
      (event: MouseEvent): void;
    }

    const handleClickOutside: ClickOutsideEventHandler = (event) => {
      const el = dropdownRef.current as HTMLElement | null;
      const target = event.target as Node | null;
      if (el && target && !el.contains(target)) {
      setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Section: Logo */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsDropdownOpen(false);
            }}
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

        {/* Right Section */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {loading ? (
            <div className="h-10 w-48 animate-pulse rounded-md bg-gray-200" />
          ) : user ? (
            <>
              {/* Profile image (works as dropdown trigger on all screens) */}
              <p className="text-2xl font-bold text-blue-500">
                {user.name.split(" ")[0]}
              </p>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="relative rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition"
              >
                <Image
                  src={profilePic || "/default-avatar.png"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover transition-transform duration-200 hover:scale-105"
                />
              </button>

              {/* Dropdown Menu (shared for desktop + mobile) */}
              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-38 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 transform origin-top transition-all duration-300 ease-out ${
                    isDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0 visible"
                      : "opacity-0 scale-95 -translate-y-2 invisible"
                  }`}
                >
                  <Link
                    href={
                      user.role === "vendor" ? "/vendor/dashboard" : "/profile"
                    }
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    {user.role === "vendor" ? "Dashboard" : "Profile"}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block cursor-pointer w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Desktop Buttons */}
              <div className="hidden md:flex items-center gap-2">
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

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-700 focus:outline-none"
                >
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
                      d={
                        isMobileMenuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown (only for logged-out users) */}
      {!user && (
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <nav className="flex flex-col space-y-4">
            <Link
              href="/restaurants"
              className="text-gray-700 hover:text-blue-600"
            >
              Restaurants
            </Link>

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
          </nav>
        </div>
      )}
    </header>
  );
}
