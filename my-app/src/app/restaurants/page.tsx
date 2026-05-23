"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import RestaurantCard from "../components/RestaurantCard";
import { Filter, LocateFixed, Search } from "lucide-react";

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
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
  distanceKm?: number;
}




export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [nearbyCity, setNearbyCity] = useState("");
  const [nearbyMessage, setNearbyMessage] = useState<string | null>(null);
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

  const fetchNearbyByCity = async () => {
    const city = nearbyCity.trim();
    if (!city) {
      setNearbyMessage("Enter a city to find nearby restaurants.");
      return;
    }

    setLoading(true);
    setError(null);
    setNearbyMessage(null);

    try {
      const res = await api.get("/restaurants/nearby/search", {
        params: { city },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setRestaurants(data);
      setNearbyMessage(`Showing restaurants near ${city}.`);
    } catch (err) {
      console.error("Failed to fetch nearby restaurants:", err);
      setError("Could not load nearby restaurants. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyByLocation = () => {
    if (!navigator.geolocation) {
      setNearbyMessage("Location is not available in this browser. Try city search.");
      return;
    }

    setLoading(true);
    setError(null);
    setNearbyMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await api.get("/restaurants/nearby/search", {
            params: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              radiusKm: 12,
            },
          });
          const data = Array.isArray(res.data) ? res.data : [];
          setRestaurants(data);
          setSortBy("distance");
          setNearbyMessage("Showing restaurants within 12 km of your location.");
        } catch (err) {
          console.error("Failed to fetch nearby restaurants:", err);
          setError("Could not load restaurants near your location.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setNearbyMessage("Location permission was not granted. Try city search.");
      }
    );
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const queryLower = query.toLowerCase();
    const nameMatch = r.name.toLowerCase().includes(queryLower);
    const cuisineMatch = r.cuisine.some((c) => c.toLowerCase().includes(queryLower));

    return (nameMatch || cuisineMatch) && (!vegOnly || r.isVeg);
  }).sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    if (sortBy === "distance") {
      return (a.distanceKm ?? Number.MAX_SAFE_INTEGER) - (b.distanceKm ?? Number.MAX_SAFE_INTEGER);
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
          <option value="distance">Nearest</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      <div className="mb-8 grid gap-3 rounded-2xl border border-[#efd9bd] bg-[#fffdf8] p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
        <label className="relative block">
          <MapCityIcon />
          <input
            placeholder="Find nearby by city"
            value={nearbyCity}
            onChange={(event) => setNearbyCity(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") fetchNearbyByCity();
            }}
            className="zaika-input pl-10"
          />
        </label>
        <button
          type="button"
          onClick={fetchNearbyByCity}
          className="rounded-xl border border-[#efd9bd] px-4 py-3 text-sm font-bold text-[#251611] transition hover:bg-[#fff1d5]"
        >
          Search Nearby
        </button>
        <button
          type="button"
          onClick={fetchNearbyByLocation}
          className="zaika-button flex items-center justify-center gap-2 px-4 py-3 text-sm"
        >
          <LocateFixed className="h-4 w-4" />
          Use Location
        </button>
        {nearbyMessage && (
          <p className="text-sm font-semibold text-[#765f55] md:col-span-3">
            {nearbyMessage}
          </p>
        )}
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

function MapCityIcon() {
  return (
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d9472b]" />
  );
}
