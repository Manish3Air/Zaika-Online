"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    axios.get("/api/restaurants").then((res) => setRestaurants(res.data));
  }, []);

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      (r.cuisine || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Restaurants</h1>
      <input
        placeholder="Search by name or cuisine"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded w-full md:w-1/2 px-3 py-2 mb-6"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  );
}
