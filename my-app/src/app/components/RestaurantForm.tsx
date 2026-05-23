"use client";

import { useState } from "react";
import { api } from "../lib/api";

interface Props {
  onSuccess: (data: any) => void;
}

export default function RestaurantForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    cuisine: "",
    logoUrl: "",
    openingHours: "",
    isVeg: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      address: {
        ...form.address,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/restaurants", {
        ...form,
        cuisine: form.cuisine
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setMessage("Restaurant created successfully!");
      onSuccess(res.data);
      setForm({
        name: "",
        description: "",
        address: {
          street: "",
          city: "",
          state: "",
          zip: "",
        },
        cuisine: "",
        logoUrl: "",
        openingHours: "",
        isVeg: false,
      });
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Error creating restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zaika-card max-w-2xl rounded-2xl p-6">
      <h2 className="text-2xl font-black text-[#251611]">Create Your Restaurant</h2>
      <p className="mb-5 mt-1 text-sm text-[#765f55]">
        Add the core details customers will see on Zaika Online.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={form.name}
          onChange={handleChange}
          className="zaika-input"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="zaika-input"
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {["street", "city", "state", "zip"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form.address[field as keyof typeof form.address]}
              onChange={handleAddressChange}
              className="zaika-input"
            />
          ))}
        </div>
        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine Types, comma separated"
          value={form.cuisine}
          onChange={handleChange}
          className="zaika-input"
        />
        <input
          type="text"
          name="openingHours"
          placeholder="Opening Hours"
          value={form.openingHours}
          onChange={handleChange}
          className="zaika-input"
        />
        <input
          type="text"
          name="logoUrl"
          placeholder="Logo/Image URL"
          value={form.logoUrl}
          onChange={handleChange}
          className="zaika-input"
        />
        <label className="flex items-center gap-2 text-sm font-semibold text-[#765f55]">
          <input
            type="checkbox"
            name="isVeg"
            checked={form.isVeg}
            onChange={handleChange}
          />
          Pure veg restaurant
        </label>
        <button
          type="submit"
          disabled={loading}
          className="zaika-button w-full py-3"
        >
          {loading ? "Creating..." : "Create Restaurant"}
        </button>
      </form>
      {message && <p className="mt-3 text-center text-sm font-semibold text-[#765f55]">{message}</p>}
    </div>
  );
}
