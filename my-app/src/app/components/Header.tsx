"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import useAuthContext from "../hooks/useAuth";
import Image from "next/image";
import { Heart, Menu, ReceiptText, Search, Store, X } from "lucide-react";

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
    <header className="sticky top-0 z-50 border-b border-[#efd9bd] bg-[#fffdf8]/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-black tracking-normal text-[#251611]"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsDropdownOpen(false);
            }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d9472b] text-base font-black text-white shadow-md">
              Z
            </span>
            <span>Zaika Online</span>
          </Link>
          <Link
            href="/restaurants"
            className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#765f55] transition hover:bg-[#fff1d5] hover:text-[#d9472b] md:flex"
          >
            <Search className="h-4 w-4" />
            Restaurants
          </Link>
        </div>

        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {loading ? (
            <div className="h-10 w-48 animate-pulse rounded-full bg-[#efd9bd]" />
          ) : user ? (
            <>
              <p className="hidden text-sm font-bold text-[#765f55] sm:block">
                {user.name.split(" ")[0]}
              </p>
              {(user.role === "customer" || user.role === "admin") && (
                <Link
                  href="/orders"
                  className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#765f55] transition hover:bg-[#fff1d5] hover:text-[#d9472b] md:flex"
                >
                  <ReceiptText className="h-4 w-4" />
                  Orders
                </Link>
              )}
              {(user.role === "customer" || user.role === "admin") && (
                <Link
                  href="/favourites"
                  className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#765f55] transition hover:bg-[#fff1d5] hover:text-[#d9472b] md:flex"
                >
                  <Heart className="h-4 w-4" />
                  Favourites
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  href="/vendor/dashboard"
                  className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#765f55] transition hover:bg-[#fff1d5] hover:text-[#d9472b] md:flex"
                >
                  <Store className="h-4 w-4" />
                  Vendor
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#765f55] transition hover:bg-[#fff1d5] hover:text-[#d9472b] md:flex"
                >
                  <ReceiptText className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="relative overflow-hidden rounded-full border-2 border-[#f4a51c] transition hover:border-[#d9472b]"
              >
                <Image
                  src={profilePic || "/default-avatar.png"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover transition-transform duration-200 hover:scale-105"
                />
              </button>

              {isDropdownOpen && (
                <div
                  className={`absolute right-0 top-12 z-50 w-52 origin-top rounded-xl border border-[#efd9bd] bg-[#fffdf8] py-2 shadow-xl transition-all duration-200 ease-out ${
                    isDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0 visible"
                      : "opacity-0 scale-95 -translate-y-2 invisible"
                  }`}
                >
                  <Link
                    href={
                      user.role === "vendor"
                        ? "/vendor/dashboard"
                        : user.role === "admin"
                          ? "/admin"
                          : "/profile"
                    }
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-[#251611] transition hover:bg-[#fff1d5]"
                  >
                    {user.role === "vendor"
                      ? "Dashboard"
                      : user.role === "admin"
                        ? "Admin"
                        : "Profile"}
                  </Link>
                  {user.role === "customer" && (
                    <>
                      <Link
                        href="/orders"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-[#251611] transition hover:bg-[#fff1d5]"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/favourites"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-[#251611] transition hover:bg-[#fff1d5]"
                      >
                        Favourite Items
                      </Link>
                    </>
                  )}
                  {user.role === "admin" && (
                    <>
                      <Link
                        href="/vendor/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-[#251611] transition hover:bg-[#fff1d5]"
                      >
                        Vendor Dashboard
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-[#251611] transition hover:bg-[#fff1d5]"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/favourites"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-[#251611] transition hover:bg-[#fff1d5]"
                      >
                        Favourite Items
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full cursor-pointer px-4 py-2 text-left text-sm font-semibold text-[#d9472b] transition hover:bg-[#fff1d5]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href={vendorLoginUrl}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-[#765f55] transition hover:bg-[#fff1d5] hover:text-[#d9472b]"
                >
                  <Store className="h-4 w-4" />
                  Sell on Zaika
                </Link>
                <Link
                  href="/login"
                  className="zaika-button px-5 py-2 text-sm"
                >
                  Login
                </Link>
              </div>

              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-full border border-[#efd9bd] p-2 text-[#251611]"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {!user && (
        <div
          className={`absolute left-0 right-0 top-full border-b border-[#efd9bd] bg-[#fffdf8] p-4 shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <nav className="flex flex-col space-y-4">
            <Link
              href="/restaurants"
              className="font-semibold text-[#251611]"
            >
              Restaurants
            </Link>

            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
              <Link
                href={vendorLoginUrl}
                className="w-full rounded-md bg-[#fff1d5] px-4 py-2 text-center font-bold text-[#765f55]"
              >
                Sell on Zaika
              </Link>
              <Link
                href="/login"
                className="zaika-button w-full px-4 py-2 text-center"
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
