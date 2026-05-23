"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bot, Heart, MapPin, MessageCircle, ReceiptText, Send, X } from "lucide-react";
import { api } from "../lib/api";
import useAuthContext from "../hooks/useAuth";

interface Restaurant {
  _id: string;
  name: string;
  cuisine?: string[];
  rating?: number;
  address?: {
    city?: string;
    state?: string;
  };
}

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  restaurantId?: {
    name?: string;
  };
}

interface FavouriteDish {
  _id: string;
  name: string;
  restaurantId?: {
    _id: string;
    name: string;
  };
}

interface ChatMessage {
  role: "assistant" | "user";
  text: string;
  actionHref?: string;
  actionLabel?: string;
}

const starterMessages: ChatMessage[] = [
  {
    role: "assistant",
    text: "Hi, I can help with nearby restaurants, order tracking, and favourite items.",
  },
];

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default function Chatbot() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favourites, setFavourites] = useState<FavouriteDish[]>([]);

  useEffect(() => {
    api
      .get("/restaurants")
      .then((res) => setRestaurants(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRestaurants([]));
  }, []);

  useEffect(() => {
    if (!user || !["customer", "admin"].includes(user.role)) {
      setOrders([]);
      setFavourites([]);
      return;
    }

    Promise.allSettled([api.get("/orders/my"), api.get("/favourites")]).then((results) => {
      const orderResult = results[0];
      const favouriteResult = results[1];

      if (orderResult.status === "fulfilled") {
        setOrders(Array.isArray(orderResult.value.data) ? orderResult.value.data : []);
      }

      if (favouriteResult.status === "fulfilled") {
        setFavourites(
          Array.isArray(favouriteResult.value.data) ? favouriteResult.value.data : []
        );
      }
    });
  }, [user]);

  const quickReplies = useMemo(
    () => [
      { label: "Nearby", value: "show nearby restaurants" },
      { label: "Track order", value: "track my latest order" },
      { label: "Favourites", value: "show my favourite items" },
    ],
    []
  );

  const replyTo = (text: string): ChatMessage => {
    const normalized = text.toLowerCase();

    if (normalized.includes("near") || normalized.includes("restaurant")) {
      const topRestaurants = restaurants
        .slice()
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);

      if (topRestaurants.length === 0) {
        return {
          role: "assistant",
          text: "I could not find restaurants right now. Try the restaurant directory.",
          actionHref: "/restaurants",
          actionLabel: "Open Restaurants",
        };
      }

      return {
        role: "assistant",
        text: `Top options: ${topRestaurants
          .map((restaurant) => restaurant.name)
          .join(", ")}. You can use city or location search for a tighter nearby list.`,
        actionHref: "/restaurants",
        actionLabel: "Find Nearby",
      };
    }

    if (normalized.includes("order") || normalized.includes("track")) {
      if (!user) {
        return {
          role: "assistant",
          text: "Please login as a customer to track orders.",
          actionHref: "/login",
          actionLabel: "Login",
        };
      }

      const latestOrder = orders[0];
      if (!latestOrder) {
        return {
          role: "assistant",
          text: "You do not have any orders yet.",
          actionHref: "/restaurants",
          actionLabel: "Browse Restaurants",
        };
      }

      return {
        role: "assistant",
        text: `Your latest order from ${
          latestOrder.restaurantId?.name || "the restaurant"
        } is ${formatStatus(latestOrder.status)}.`,
        actionHref: "/orders",
        actionLabel: "Open Orders",
      };
    }

    if (
      normalized.includes("fav") ||
      normalized.includes("heart") ||
      normalized.includes("saved")
    ) {
      if (!user) {
        return {
          role: "assistant",
          text: "Login as a customer to save and view favourite items.",
          actionHref: "/login",
          actionLabel: "Login",
        };
      }

      if (favourites.length === 0) {
        return {
          role: "assistant",
          text: "No favourite items yet. Tap the heart on any dish to save it.",
          actionHref: "/restaurants",
          actionLabel: "Browse Menus",
        };
      }

      return {
        role: "assistant",
        text: `Your favourites include ${favourites
          .slice(0, 3)
          .map((item) => item.name)
          .join(", ")}.`,
        actionHref: "/favourites",
        actionLabel: "Open Favourites",
      };
    }

    return {
      role: "assistant",
      text: "I can help you find nearby restaurants, track your latest order, or open your favourite items.",
    };
  };

  const sendMessage = (message = input) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      replyTo(trimmed),
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <section className="mb-3 flex h-[32rem] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#efd9bd] bg-[#fffdf8] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#efd9bd] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d9472b] text-white">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-black text-[#251611]">Zaika Chat</h2>
                <p className="text-xs font-semibold text-[#765f55]">Food help, fast</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-[#765f55] transition hover:bg-[#fff1d5]"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-[#d9472b] text-white"
                    : "bg-[#fff1d5] text-[#251611]"
                }`}
              >
                <p>{message.text}</p>
                {message.actionHref && message.actionLabel && (
                  <Link
                    href={message.actionHref}
                    onClick={() => setOpen(false)}
                    className="mt-2 inline-flex rounded-lg bg-[#fffdf8] px-3 py-1.5 text-xs font-black text-[#d9472b]"
                  >
                    {message.actionLabel}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-[#efd9bd] p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto">
              {quickReplies.map((reply) => (
                <button
                  key={reply.value}
                  type="button"
                  onClick={() => sendMessage(reply.value)}
                  className="flex shrink-0 items-center gap-1 rounded-full border border-[#efd9bd] px-3 py-1.5 text-xs font-bold text-[#765f55] transition hover:bg-[#fff1d5]"
                >
                  {reply.label === "Nearby" && <MapPin className="h-3.5 w-3.5" />}
                  {reply.label === "Track order" && <ReceiptText className="h-3.5 w-3.5" />}
                  {reply.label === "Favourites" && <Heart className="h-3.5 w-3.5" />}
                  {reply.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                placeholder="Ask Zaika..."
                className="zaika-input"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                className="zaika-button flex h-11 w-11 shrink-0 items-center justify-center"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="zaika-button flex h-14 w-14 items-center justify-center rounded-full"
        aria-label="Open Zaika chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
