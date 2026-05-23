"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import RestaurantCard from "../components/RestaurantCard";
import { Filter, Search } from "lucide-react";

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface Restaurant {
  _id: string;
  ownerId: string;
  name: string;
  description: string;
  address?: Address;
  logoUrl?: string;
  cuisine: string[];
  openingHours?: string;
  isVeg: boolean;
  rating: number;
}




export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/restaurants")
      .then((res) => {
        setRestaurants(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch restaurants:", err);
        setError("Could not load restaurants. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredRestaurants = restaurants.filter((r) => {
    const queryLower = query.toLowerCase();
    const nameMatch = r.name.toLowerCase().includes(queryLower);
    const cuisineMatch = r.cuisine.some((c) => c.toLowerCase().includes(queryLower));

    return (nameMatch || cuisineMatch) && (!vegOnly || r.isVeg);
  }).sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    return (b.rating || 0) - (a.rating || 0);
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-[#765f55]">
        Loading restaurants...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-[#d9472b]">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d9472b]">
            Restaurant directory
          </p>
          <h1 className="mt-2 text-4xl font-black text-[#251611]">
            All Restaurants
          </h1>
          <p className="mt-2 max-w-2xl text-[#765f55]">
            Search by kitchen name or cuisine and jump straight into the menu.
          </p>
        </div>
        <div className="rounded-full border border-[#efd9bd] bg-[#fffdf8] px-4 py-2 text-sm font-bold text-[#765f55]">
          {filteredRestaurants.length} places
        </div>
      </div>
      <div className="mb-8 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d9472b]" />
          <input
            placeholder="Search by name or cuisine"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="zaika-input pl-10"
          />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-xl border border-[#efd9bd] bg-[#fffdf8] px-4 py-3 text-sm font-bold text-[#765f55]">
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#d9472b]" />
            Veg only
          </span>
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) => setVegOnly(e.target.checked)}
            className="h-4 w-4 accent-[#15803d]"
          />
        </label>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="zaika-input lg:w-44"
        >
          <option value="rating">Top rated</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((r) => (
            <RestaurantCard key={r._id} restaurant={r} />
          ))
        ) : (
          <div className="zaika-card rounded-2xl p-8 text-[#765f55] md:col-span-2 lg:col-span-3">
            No restaurants match your search.
          </div>
        )}
      </div>
    </div>
  );
}
