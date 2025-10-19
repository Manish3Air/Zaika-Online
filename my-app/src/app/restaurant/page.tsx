"use client";

import { useEffect, useState } from "react";
import {api} from "../lib/api";
import RestaurantCard from "../components/RestaurantCard";

// A separate interface for the nested address object for better organization
interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

// The main interface for the Restaurant object
interface Restaurant {
  _id: string; // Typically included from the database
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
  const [loading, setLoading] = useState(true); // State to handle loading UI
  const [error, setError] = useState<string | null>(null); // State to handle errors

  useEffect(() => {
    // 1. Correct the API endpoint to include '/api'
    api.get("/restaurants")
      .then((res) => {
        // 2. Extract the actual array from the 'data' property
        setRestaurants(res.data);
      })
      .catch((err) => {
        // 3. Handle potential errors during the API call
        console.error("Failed to fetch restaurants:", err);
        setError("Could not load restaurants. Please try again later.");
      })
      .finally(() => {
        setLoading(false); // Stop loading once the request is complete
      });
  }, []); // Empty dependency array means this runs once on mount

  // Filter logic is now more robust
  const filteredRestaurants = restaurants.filter((r) => {
    const queryLower = query.toLowerCase();
    const nameMatch = r.name.toLowerCase().includes(queryLower);
    
    // 4. Correctly search within the 'cuisine' array
    const cuisineMatch = r.cuisine.some(c => c.toLowerCase().includes(queryLower));

    return nameMatch || cuisineMatch;
  });

  // Display a loading message
  if (loading) {
    return <div className="text-center p-8">Loading restaurants...</div>;
  }
  
  // Display an error message
  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

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
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((r) => (
            // 5. Use the correct unique key '_id' from MongoDB
            <RestaurantCard key={r._id} restaurant={r} />
          ))
        ) : (
          <p>No restaurants match your search.</p>
        )}
      </div>
    </div>
  );
}