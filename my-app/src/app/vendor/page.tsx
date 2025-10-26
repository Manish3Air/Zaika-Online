"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { useAuthContext } from "../lib/auth";

interface RestaurantFormData {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  cuisine: string;
  openingHours: string;
}

export default function RegisterRestaurantPage() {
  const router = useRouter();
  const { user } = useAuthContext();

  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    description: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    cuisine: "",
    openingHours: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle top-level input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle nested address object changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (user?.role !== "vendor") {
    setError("You must be logged in as a vendor to register a restaurant.");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const token = localStorage.getItem("zaika_token");

    if (!token) {
      setError("You must be logged in first.");
      setLoading(false);
      return;
    }

    const cuisineArray = formData.cuisine
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);

    const submissionData = {
      ...formData,
      cuisine: cuisineArray,
    };

    const response = await api.post("/restaurants", submissionData, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ send token in header
      },
    });

    alert("Restaurant registered successfully!");
    router.push(`/vendor/dashboard`);
  } catch (err: any) {
    console.error(err);
    setError(err.response?.data?.message || "Failed to register restaurant.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-2">
          Register Your Restaurant
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Fill out the details below to get your restaurant listed on{" "}
          <span className="font-semibold">Zaika Online</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BASIC DETAILS */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
              Basic Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* ADDRESS SECTION */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
              Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {["street", "city", "state", "zip"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-1 capitalize"
                  >
                    {field}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={(formData.address as any)[field]}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* OTHER DETAILS */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
              Other Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuisine Types
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Separate multiple cuisines with commas (e.g., North Indian,
                Chinese, Italian)
              </p>
              <input
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Hours
              </label>
              <input
                type="text"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                placeholder="e.g., 9:00 AM - 10:00 PM"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* FEEDBACK / SUBMIT */}
          <div className="pt-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                {success}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:scale-[1.02] transition-transform duration-200 disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register Restaurant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
