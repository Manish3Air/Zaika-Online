"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  BarChart3,
  ClipboardList,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import withAuth from "../components/withAuth";
import { api } from "../lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface Restaurant {
  _id: string;
  name: string;
  cuisine?: string[];
  rating?: number;
  isListed?: boolean;
  isAppreciated?: boolean;
  appreciationNote?: string;
  ownerId?: {
    name?: string;
    email?: string;
  };
}

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customerId?: {
    name?: string;
    email?: string;
  };
  restaurantId?: {
    name?: string;
  };
}

interface AdminOverview {
  stats: {
    users: number;
    customers: number;
    vendors: number;
    restaurants: number;
    listedRestaurants: number;
    dishes: number;
    orders: number;
    activeOrders: number;
    totalRevenue: number;
  };
  customers: User[];
  vendors: User[];
  restaurants: Restaurant[];
  orders: Order[];
  topVendors: (Restaurant & { orderCount: number })[];
}

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof BarChart3;
}) {
  return (
    <div className="zaika-card rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#765f55]">{label}</p>
          <p className="mt-2 text-3xl font-black text-[#251611]">{value}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1d5] text-[#d9472b]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function AdminPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [activeView, setActiveView] = useState("super");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = async () => {
    try {
      setError(null);
      const res = await api.get("/admin/overview");
      setOverview(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const updateListing = async (restaurant: Restaurant) => {
    console.log("We are reaching here");
    console.log("Updating listing status for restaurant:", restaurant._id, "Current isListed:", restaurant.isListed);
    const res = await api.patch(`/admin/restaurants/${restaurant._id}/listing`, {
      isListed: restaurant.isListed === false,
    });
    setOverview((current) =>
      current
        ? {
            ...current,
            restaurants: current.restaurants.map((item) =>
              item._id === restaurant._id ? res.data : item
            ),
          }
        : current
    );
  };

  const updateAppreciation = async (restaurant: Restaurant) => {
    const nextValue = !restaurant.isAppreciated;
    const res = await api.patch(`/admin/restaurants/${restaurant._id}/appreciation`, {
      isAppreciated: nextValue,
      appreciationNote: nextValue ? "Recognized for strong performance" : "",
    });
    setOverview((current) =>
      current
        ? {
            ...current,
            restaurants: current.restaurants.map((item) =>
              item._id === restaurant._id ? res.data : item
            ),
          }
        : current
    );
  };

  if (loading) {
    return <div className="px-4 py-16 text-center text-[#765f55]">Loading admin dashboard...</div>;
  }

  if (error || !overview) {
    return <div className="px-4 py-16 text-center text-[#d9472b]">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d9472b]">
            Owner control center
          </p>
          <h1 className="mt-2 text-4xl font-black text-[#251611]">
            Admin Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-[#765f55]">
            See platform health, customer activity, vendor performance, and listing controls.
          </p>
        </div>

        <div className="grid grid-cols-3 rounded-xl border border-[#efd9bd] bg-[#fffdf8] p-1 text-sm font-bold">
          {[
            ["super", "Super"],
            ["vendors", "Vendors"],
            ["customers", "Customers"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`rounded-lg px-4 py-2 transition ${
                activeView === key
                  ? "bg-[#d9472b] text-white"
                  : "text-[#765f55] hover:bg-[#fff1d5]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeView === "super" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total revenue" value={money(overview.stats.totalRevenue)} icon={TrendingUp} />
            <StatCard label="Active orders" value={overview.stats.activeOrders} icon={ClipboardList} />
            <StatCard label="Customers" value={overview.stats.customers} icon={Users} />
            <StatCard label="Listed vendors" value={`${overview.stats.listedRestaurants}/${overview.stats.restaurants}`} icon={Store} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <section className="zaika-card rounded-2xl p-6">
              <h2 className="text-2xl font-black text-[#251611]">Top Vendors</h2>
              <div className="mt-4 space-y-3">
                {overview.topVendors.map((vendor) => (
                  <div key={vendor._id} className="flex items-center justify-between rounded-xl bg-[#fff8ed] p-3">
                    <div>
                      <p className="font-bold text-[#251611]">{vendor.name}</p>
                      <p className="text-sm text-[#765f55]">{vendor.ownerId?.email || "No owner email"}</p>
                    </div>
                    <span className="rounded-full bg-[#fff1d5] px-3 py-1 text-sm font-black text-[#d9472b]">
                      {vendor.orderCount} orders
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="zaika-card rounded-2xl p-6">
              <h2 className="text-2xl font-black text-[#251611]">Recent Orders</h2>
              <div className="mt-4 space-y-3">
                {overview.orders.slice(0, 6).map((order) => (
                  <div key={order._id} className="flex items-center justify-between rounded-xl bg-[#fff8ed] p-3">
                    <div>
                      <p className="font-bold text-[#251611]">{order.restaurantId?.name || "Restaurant"}</p>
                      <p className="text-sm text-[#765f55]">{order.customerId?.email || "Customer"} · {order.status.replaceAll("_", " ")}</p>
                    </div>
                    <p className="font-black text-[#d9472b]">{money(order.totalAmount)}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {activeView === "vendors" && (
        <div className="space-y-4">
          {overview.restaurants.map((restaurant) => (
            <article key={restaurant._id} className="zaika-card rounded-2xl p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black text-[#251611]">{restaurant.name}</h2>
                    {restaurant.isAppreciated && (
                      <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Appreciated
                      </span>
                    )}
                    {restaurant.isListed === false && (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                        Delisted
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[#765f55]">
                    {restaurant.ownerId?.name || "Vendor"} · {restaurant.ownerId?.email || "No email"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#765f55]">
                    {(restaurant.cuisine || []).join(", ") || "Cuisine not set"} · Rating {restaurant.rating || 0}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateAppreciation(restaurant)}
                    className="rounded-xl border border-[#efd9bd] bg-[#fffdf8] px-4 py-2 text-sm font-bold text-[#251611] transition hover:bg-[#fff1d5]"
                  >
                    {restaurant.isAppreciated ? "Remove Appreciation" : "Appreciate"}
                  </button>
                  <button
                    onClick={() => updateListing(restaurant)}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                      restaurant.isListed === false
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-[#d9472b] text-white hover:bg-[#b73521]"
                    }`}
                  >
                    {restaurant.isListed === false ? "Relist Vendor" : "Delist Vendor"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeView === "customers" && (
        <div className="zaika-card overflow-hidden rounded-2xl">
          <div className="grid grid-cols-[1.2fr_1.5fr_0.8fr] border-b border-[#efd9bd] bg-[#fff8ed] p-4 text-sm font-black text-[#251611]">
            <span>Name</span>
            <span>Email</span>
            <span>Joined</span>
          </div>
          {overview.customers.map((customer) => (
            <div
              key={customer._id}
              className="grid grid-cols-[1.2fr_1.5fr_0.8fr] border-b border-[#efd9bd] p-4 text-sm text-[#765f55] last:border-b-0"
            >
              <span className="font-bold text-[#251611]">{customer.name}</span>
              <span>{customer.email}</span>
              <span>
                {customer.createdAt
                  ? new Date(customer.createdAt).toLocaleDateString("en-IN")
                  : "N/A"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(AdminPage, "admin");
