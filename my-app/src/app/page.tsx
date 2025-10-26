"use server";

import RestaurantCard from "./components/RestaurantCard";

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

async function fetchRestaurants(): Promise<Restaurant[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const url = `${base}/restaurants`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Error: ${res.status} ${res.statusText}`, errorText);
      return []; 
    }

    const responseData = await res.json();

    

    const restaurants = responseData || [];
    // console.log("Fetched restaurants:", restaurants);
    
    return restaurants;

  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    // Return an empty array in case of a network error or other exception
    return [];
  }
}

export default async function HomePage() {
  const restaurants = await fetchRestaurants();
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <h2 className="text-2xl font-semibold">No Restaurants Found</h2>
        <p>There was an issue loading restaurants, or none are available at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Discover Great Food Near You</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {restaurants.map((r) => (
          <RestaurantCard key={r._id} restaurant={r} />
        ))}
      </div>
    </div>
  );
}