"use client";

import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Pencil, Trash2 } from "lucide-react";

interface Dish {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  imageUrl?: string;
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
    imageUrl: "",
  });

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  /** 🥗 Fetch Dishes for this Restaurant **/
  const fetchDishes = async () => {
    if (!restaurantId) return;
    try {
      const res = await api.get(`/dishes/restaurants/${restaurantId}/dishes`);
      setDishes(res.data || []);
    } catch (err) {
      console.error("Error fetching dishes:", err);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, [restaurantId]);

  /** ✏️ Handle Form Input Changes **/
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /** 💾 Add / Update Dish **/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return alert("Restaurant ID missing");
    setLoading(true);

    try {
      if (editingDish) {
        // Update existing dish
        await api.put(`/dishes/${editingDish._id}`, { ...form, restaurantId });
      } else {
        // Add new dish
        await api.post(`/dishes`, { ...form, restaurantId });
      }

      // Refresh dishes after change
      await fetchDishes();

      // Reset form
      setForm({
        name: "",
        description: "",
        price: 0,
        category: "",
        isVeg: true,
        imageUrl: "",
      });
      setEditingDish(null);
    } catch (err) {
      console.error("Error saving dish:", err);
      alert("Failed to save dish");
    } finally {
      setLoading(false);
    }
  };

  /** ✍️ Edit Dish **/
  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setForm({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      isVeg: dish.isVeg,
      imageUrl: dish.imageUrl || "",
      _id: dish._id,
    });
  };

  /** ❌ Delete Dish **/
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this dish?")) return;
    try {
      await api.delete(`/dishes/${id}`);
      await fetchDishes();
    } catch (err) {
      console.error("Error deleting dish:", err);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {editingDish ? "Edit Dish" : "Add New Dish"}
      </h2>

      {/* 🧾 Dish Form */}
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

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={handleChange}
          className="md:col-span-2 border rounded-md px-3 py-2"
        />

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
          {loading ? "Saving..." : editingDish ? "Update Dish" : "Add Dish"}
        </button>
      </form>

      {/* 🍽 Dish List */}
      <h3 className="text-lg font-semibold mt-6 mb-3">Your Dishes</h3>

      {dishes.length === 0 ? (
        <p className="text-sm text-gray-500">No dishes yet.</p>
      ) : (
        <ul className="space-y-3">
          {dishes.map((d) => (
            <li
              key={d._id}
              className="border rounded-md p-3 flex justify-between items-center"
            >
              <div className="flex gap-3 items-center">
                {d.imageUrl && (
                  <img
                    src={d.imageUrl}
                    alt={d.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                <div>
                  <h4 className="font-medium">{d.name}</h4>
                  <p className="text-sm text-gray-600">{d.description}</p>
                  <p className="text-sm text-gray-500">₹{d.price}</p>
                  <p className="text-sm">{d.category}</p>
                  {d.isVeg ? (
                    <span className="text-green-600">🌱 Veg</span>
                  ) : (
                    <span className="text-red-600">🍗 Non-Veg</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(d)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(d._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
