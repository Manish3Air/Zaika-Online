"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import useAuthContext from "../hooks/useAuth";

interface FavouriteDish {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  category?: string;
  isVeg: boolean;
  restaurantId?: {
    _id: string;
    name: string;
    logoUrl?: string;
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function FavouritesPage() {
  const { user, loading: authLoading } = useAuthContext();
  const [items, setItems] = useState<FavouriteDish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    api
      .get("/favourites")
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Could not load favourite items."))
      .finally(() => setLoading(false));
  }, [authLoading, user]);

  const removeFavourite = async (dishId: string) => {
    const previous = items;
    setItems((current) => current.filter((item) => item._id !== dishId));

    try {
      const res = await api.delete(`/favourites/${dishId}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      setItems(previous);
      setError("Could not remove this favourite.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-[#765f55]">
        Loading favourites...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="zaika-card rounded-2xl p-8">
          <Heart className="mx-auto h-10 w-10 text-[#d9472b]" />
          <h1 className="mt-4 text-3xl font-black text-[#251611]">
            Login to save favourites
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[#765f55]">
            Favourite dishes are available after you sign in as a customer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d9472b]">
            Saved dishes
          </p>
          <h1 className="mt-2 text-4xl font-black text-[#251611]">
            Favourite Items
          </h1>
          <p className="mt-2 max-w-2xl text-[#765f55]">
            Keep your go-to plates close and jump back to their restaurants.
          </p>
        </div>
        <div className="rounded-full border border-[#efd9bd] bg-[#fffdf8] px-4 py-2 text-sm font-bold text-[#765f55]">
          {items.length} saved
        </div>
      </div>

      {error && (
        <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <div className="zaika-card rounded-2xl p-8 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-[#d9472b]" />
          <h2 className="mt-4 text-2xl font-black text-[#251611]">
            No favourites yet
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[#765f55]">
            Open a restaurant menu and tap the heart on dishes you love.
          </p>
          <Link href="/restaurants" className="zaika-button mt-5 inline-block px-6 py-3">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item._id}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-[#efd9bd] bg-[#fffdf8] shadow-sm"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-44 w-full object-cover"
                />
              )}
              <div className="flex flex-grow flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-[#251611]">{item.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-[#765f55]">
                      {item.restaurantId?.name || "Restaurant"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFavourite(item._id)}
                    className="rounded-full p-2 text-[#d9472b] transition hover:bg-red-50"
                    aria-label={`Remove ${item.name}`}
                    title="Remove favourite"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-[#765f55]">
                  {item.description || "A saved Zaika favourite."}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="font-black text-[#d9472b]">
                    {formatCurrency(item.price)}
                  </span>
                  {item.restaurantId?._id && (
                    <Link
                      href={`/restaurants/${item.restaurantId._id}`}
                      className="rounded-xl border border-[#efd9bd] px-4 py-2 text-sm font-bold text-[#251611] transition hover:bg-[#fff1d5]"
                    >
                      Order again
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
