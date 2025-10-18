"use client";

import Link from "next/link";

interface Restaurant {
  id: string;
  name: string;
  image?: string;
  cuisine?: string;
  address?: string;
  rating?: number;
}

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
    >
      <img
        src={restaurant.image || "/placeholder.jpg"}
        alt={restaurant.name}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h3 className="text-lg font-semibold mb-1">{restaurant.name}</h3>
      <p className="text-sm text-gray-600">{restaurant.cuisine || "Various cuisines"}</p>
      {restaurant.rating && (
        <p className="text-yellow-500 text-sm mt-1">⭐ {restaurant.rating}/5</p>
      )}
      <p className="text-xs text-gray-500 mt-auto">{restaurant.address}</p>
    </Link>
  );
}