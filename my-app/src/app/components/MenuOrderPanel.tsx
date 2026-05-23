"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import useAuthContext from "../hooks/useAuth";

interface Dish {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  category?: string;
  isVeg: boolean;
}

interface CartItem {
  dish: Dish;
  quantity: number;
}

interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

const emptyAddress: DeliveryAddress = {
  street: "",
  city: "",
  state: "",
  zip: "",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function MenuOrderPanel({
  restaurantId,
  dishes,
}: {
  restaurantId: string;
  dishes: Dish[];
}) {
  const { user } = useAuthContext();
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [address, setAddress] = useState<DeliveryAddress>(emptyAddress);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );
  const deliveryFee = itemCount > 0 ? 29 : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!user || !["customer", "admin"].includes(user.role)) return;

    api
      .get("/favourites")
      .then((res) => {
        const ids = Array.isArray(res.data)
          ? res.data.map((dish: Dish) => dish._id)
          : [];
        setFavouriteIds(new Set(ids));
      })
      .catch(() => {
        setFavouriteIds(new Set());
      });
  }, [user]);

  const updateQuantity = (dish: Dish, delta: number) => {
    setMessage(null);
    setError(null);
    setCart((current) => {
      const existing = current[dish._id]?.quantity || 0;
      const nextQuantity = existing + delta;
      const nextCart = { ...current };

      if (nextQuantity <= 0) {
        delete nextCart[dish._id];
      } else {
        nextCart[dish._id] = { dish, quantity: nextQuantity };
      }

      return nextCart;
    });
  };

  const toggleFavourite = async (dish: Dish) => {
    setMessage(null);
    setError(null);

    if (!user || !["customer", "admin"].includes(user.role)) {
      setError("Please login as a customer to save favourite items.");
      return;
    }

    const isFavourite = favouriteIds.has(dish._id);
    const nextIds = new Set(favouriteIds);

    if (isFavourite) {
      nextIds.delete(dish._id);
    } else {
      nextIds.add(dish._id);
    }

    setFavouriteIds(nextIds);

    try {
      const res = isFavourite
        ? await api.delete(`/favourites/${dish._id}`)
        : await api.post(`/favourites/${dish._id}`);
      const ids = Array.isArray(res.data)
        ? res.data.map((item: Dish) => item._id)
        : Array.from(nextIds);
      setFavouriteIds(new Set(ids));
    } catch (err: any) {
      setFavouriteIds(favouriteIds);
      setError(err?.response?.data?.message || "Could not update favourites.");
    }
  };

  const placeOrder = async () => {
    setMessage(null);
    setError(null);

    if (!user) {
      setError("Please login as a customer before placing an order.");
      return;
    }

    if (!["customer", "admin"].includes(user.role)) {
      setError("Vendor accounts can manage menus, but cannot place customer orders.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Add at least one dish to your cart.");
      return;
    }

    const hasAddress = Object.values(address).every((value) => value.trim());
    if (!hasAddress) {
      setError("Please complete your delivery address.");
      return;
    }

    try {
      setPlacingOrder(true);
      await api.post("/orders", {
        restaurantId,
        items: cartItems.map((item) => ({
          dishId: item.dish._id,
          quantity: item.quantity,
        })),
        deliveryAddress: address,
        paymentDetails: {
          status: "pending",
        },
      });

      setCart({});
      setAddress(emptyAddress);
      setMessage("Order placed successfully. You can track it from My Orders.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not place order right now.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (dishes.length === 0) {
    return (
      <div className="zaika-card rounded-2xl p-8 text-[#765f55]">
        No dishes available for this restaurant.
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {dishes.map((dish) => {
          const quantity = cart[dish._id]?.quantity || 0;
          const isFavourite = favouriteIds.has(dish._id);

          return (
            <div
              key={dish._id}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#efd9bd] bg-[#fffdf8] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              {dish.imageUrl && (
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              )}

              <div className="flex flex-grow flex-col p-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-black text-[#251611]">
                    {dish.name}
                  </h3>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-[#fff1d5] px-3 py-1 text-sm font-black text-[#d9472b]">
                      {formatCurrency(dish.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFavourite(dish)}
                      className={`rounded-full border p-2 transition ${
                        isFavourite
                          ? "border-[#d9472b] bg-red-50 text-[#d9472b]"
                          : "border-[#efd9bd] text-[#765f55] hover:bg-[#fff1d5] hover:text-[#d9472b]"
                      }`}
                      aria-label={`${isFavourite ? "Remove" : "Save"} ${dish.name} as favourite`}
                      title={isFavourite ? "Remove favourite" : "Add favourite"}
                    >
                      <Heart className={`h-4 w-4 ${isFavourite ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#765f55]">
                  {dish.description || "No description provided."}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold">
                  <span
                    className={`rounded-full px-3 py-1 ${
                      dish.isVeg
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {dish.isVeg ? "Veg" : "Non-Veg"}
                  </span>
                  {dish.category && (
                    <span className="rounded-full bg-[#f7ead6] px-3 py-1 text-[#765f55]">
                      {dish.category}
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-5">
                  {quantity === 0 ? (
                    <button
                      type="button"
                      onClick={() => updateQuantity(dish, 1)}
                      className="zaika-button flex w-full items-center justify-center gap-2 px-4 py-2.5"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border border-[#efd9bd] bg-[#fff8ed] p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(dish, -1)}
                        className="rounded-lg p-2 text-[#d9472b] transition hover:bg-[#fff1d5]"
                        aria-label={`Remove one ${dish.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-black text-[#251611]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(dish, 1)}
                        className="rounded-lg p-2 text-[#15803d] transition hover:bg-green-50"
                        aria-label={`Add one ${dish.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <aside className="zaika-card sticky top-24 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d9472b]">
              Cart
            </p>
            <h3 className="mt-1 text-2xl font-black text-[#251611]">
              Your order
            </h3>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1d5] text-[#d9472b]">
            <ShoppingBag className="h-5 w-5" />
          </span>
        </div>

        {cartItems.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-[#efd9bd] p-4 text-sm font-medium text-[#765f55]">
            Add dishes from the menu to start an order.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.dish._id}
                className="flex items-start justify-between gap-3 rounded-xl bg-[#fff8ed] p-3"
              >
                <div>
                  <p className="font-bold text-[#251611]">{item.dish.name}</p>
                  <p className="text-sm text-[#765f55]">
                    {item.quantity} x {formatCurrency(item.dish.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.dish, -item.quantity)}
                  className="rounded-lg p-2 text-[#d9472b] transition hover:bg-[#fff1d5]"
                  aria-label={`Remove ${item.dish.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 space-y-2 border-t border-[#efd9bd] pt-4 text-sm">
          <div className="flex justify-between text-[#765f55]">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#765f55]">
            <span>Delivery</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-lg font-black text-[#251611]">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <input
            className="zaika-input"
            placeholder="Street"
            value={address.street}
            onChange={(event) =>
              setAddress((current) => ({ ...current, street: event.target.value }))
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="zaika-input"
              placeholder="City"
              value={address.city}
              onChange={(event) =>
                setAddress((current) => ({ ...current, city: event.target.value }))
              }
            />
            <input
              className="zaika-input"
              placeholder="State"
              value={address.state}
              onChange={(event) =>
                setAddress((current) => ({ ...current, state: event.target.value }))
              }
            />
          </div>
          <input
            className="zaika-input"
            placeholder="PIN code"
            value={address.zip}
            onChange={(event) =>
              setAddress((current) => ({ ...current, zip: event.target.value }))
            }
          />
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={placeOrder}
          disabled={placingOrder || cartItems.length === 0}
          className="zaika-button mt-5 w-full px-4 py-3"
        >
          {placingOrder ? "Placing order..." : "Place Order"}
        </button>
      </aside>
    </div>
  );
}
