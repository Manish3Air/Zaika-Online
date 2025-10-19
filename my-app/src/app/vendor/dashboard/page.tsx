"use client";

import { useEffect, useState } from "react";
import withAuth from "../../components/withAuth";
import RestaurantForm from "../../components/RestaurantForm";
import DishForm from "../../components/DishForm";
import {api} from "../../lib/api";

// A separate interface for the nested address object for better organization
interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

// The main interface for the Restaurant object
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

function Dashboard() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMyRestaurant() {
      try {
        const res = await api.get("/restaurants", {
          signal: controller.signal,
        });
        setRestaurant(res.data ?? null);
      } catch (err) {
        if (
          (err as any)?.name === "CanceledError" ||
          (err as any)?.message === "canceled"
        ) {
          // request was aborted — ignore
        } else {
          setRestaurant(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMyRestaurant();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
      {!restaurant ? (
        <RestaurantForm onSuccess={setRestaurant} />
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-3">
            {restaurant.name} — Menu
          </h2>
          <DishForm restaurantId={restaurant._id} />
        </>
      )}
    </div>
  );
}

export default withAuth(Dashboard, "vendor");
