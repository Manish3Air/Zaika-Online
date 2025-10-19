"use client";

import Link from "next/link";

// 1. Updated interface to match the schema
interface Restaurant {
  _id: string;
  name: string;
  logoUrl?: string;          // <-- Changed from 'image' to 'logoUrl'
  cuisine?: string[];        // <-- Changed from 'string' to 'string[]' (an array)
  address?: {                // <-- Changed from 'string' to an object
    street?: string;
    city?: string;
    state?: string;
  };
  rating?: number;
}

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  // Helper to format the address object into a string
  const formattedAddress = restaurant.address 
    ? `${restaurant.address.street}, ${restaurant.address.city}` 
    : "Address not available";

  return (
    <Link
      href={`/restaurant/${restaurant._id}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <img
        // 2. Use 'logoUrl' for the image source
        src={restaurant.logoUrl || "/placeholder.jpg"} // <-- Changed from restaurant.image
        alt={restaurant.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-1 truncate">{restaurant.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {/* 3. Join the cuisine array to display it as a string */}
          {restaurant.cuisine?.join(', ') || "Various cuisines"} 
        </p>
        {restaurant.rating && (
          <p className="text-yellow-500 text-sm font-bold">⭐ {restaurant.rating.toFixed(1)}</p>
        )}
        {/* 4. Display the formatted address string */}
        <p className="text-xs text-gray-500 mt-auto pt-2">{formattedAddress}</p> 
      </div>
    </Link>
  );
}