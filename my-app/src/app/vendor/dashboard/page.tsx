"use client";

import { useEffect, useState } from "react";
import withAuth from "../../components/withAuth";
import RestaurantForm from "../../components/RestaurantForm";
import DishForm from "../../components/DishForm";
import axios from "axios";

type Restaurant = {
  id: string;
  name: string;
  [key: string]: any;
};

function Dashboard() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMyRestaurant() {
      try {
        const res = await axios.get("/api/restaurants/my", {
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
          <DishForm restaurantId={restaurant.id} />
        </>
      )}
    </div>
  );
}

export default withAuth(Dashboard, "vendor");
