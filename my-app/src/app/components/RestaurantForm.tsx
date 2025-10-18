"use client";

import { useState } from "react";
import axios from "axios";

interface Props {
  onSuccess: (data: any) => void;
}

export default function RestaurantForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    cuisine: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/restaurants", form);
      setMessage("Restaurant created successfully!");
      onSuccess(res.data);
      setForm({ name: "", address: "", cuisine: "", image: "" });
    } catch (err: any) {
      setMessage("Error creating restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Your Restaurant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
          required
        />
        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine Type"
          value={form.cuisine}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          {loading ? "Creating..." : "Create Restaurant"}
        </button>
      </form>
      {message && <p className="text-sm mt-3 text-center">{message}</p>}
    </div>
  );
}
