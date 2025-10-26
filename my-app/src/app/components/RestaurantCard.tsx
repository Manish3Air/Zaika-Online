"use client";

import Link from "next/link";


interface Restaurant {
  _id: string;
  name: string;
  logoUrl?: string;         
  cuisine?: string[];        
  address?: {                
    street?: string;
    city?: string;
    state?: string;
  };
  rating?: number;
}

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const formattedAddress = restaurant.address 
    ? `${restaurant.address.street}, ${restaurant.address.city}` 
    : "Address not available";

  return (
    <Link
      href={`/restaurant/${restaurant._id}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <img
        src={restaurant.logoUrl || "/placeholder.jpg"} 
        alt={restaurant.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-1 truncate">{restaurant.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {restaurant.cuisine?.join(', ') || "Various cuisines"} 
        </p>
        {restaurant.rating && (
          <p className="text-yellow-500 text-sm font-bold">⭐ {restaurant.rating.toFixed(1)}</p>
        )}
        <p className="text-xs text-gray-500 mt-auto pt-2">{formattedAddress}</p> 
      </div>
    </Link>
  );
}