"use client";

import { useState, useEffect } from "react";
import {api} from "../lib/api";

interface Dish {
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
}

interface Props {
  restaurantId: string;
}

export default function DishForm({ restaurantId }: Props) {
  const [form, setForm] = useState<Dish>({
    name: "",
    description: "",
    price: 0,
    category: "",
    isVeg: true,
  });

  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDishes = async () => {
    const res = await api.get(`/restaurants/${restaurantId}/dishes`);
    setDishes(res.data);
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/restaurants/${restaurantId}/dishes`, form);
      await fetchDishes();
      setForm({ name: "", description: "", price: 0, category: "", isVeg: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Add Dish</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Dish Name"
          value={form.name}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g., Starter, Main Course)"
          value={form.category}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isVeg"
            checked={form.isVeg}
            onChange={handleChange}
          />
          <span>Vegetarian</span>
        </label>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="md:col-span-2 border rounded-md px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Adding..." : "Add Dish"}
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-6 mb-2">Your Dishes</h3>
      {dishes.length === 0 ? (
        <p className="text-sm text-gray-500">No dishes yet.</p>
      ) : (
        <ul className="space-y-3">
          {dishes.map((d) => (
            <li
              key={d.id}
              className="border rounded-md p-3 flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium">{d.name}</h4>
                <p className="text-sm text-gray-600">{d.description}</p>
                <span className="text-sm">₹{d.price}</span>
                {d.isVeg ? (
                  <span className="ml-2 text-green-600">🌱 Veg</span>
                ) : (
                  <span className="ml-2 text-red-600">🍗 Non-Veg</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
