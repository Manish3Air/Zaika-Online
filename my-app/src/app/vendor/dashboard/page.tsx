"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  UtensilsCrossed,
  ClipboardList,
  User,
  BarChart2,
  LogOut,
} from "lucide-react";
import withAuth from "../../components/withAuth";
import RestaurantForm from "../../components/RestaurantForm";
import DishForm from "../../components/DishForm";
import { api } from "../../lib/api";

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
  cuisine?: string[]; // made optional
  openingHours?: string;
  isVeg: boolean;
  rating: number;
}

interface OrderItem {
  _id?: string;
  name?: string;
  quantity: number;
  price?: number;
}

interface VendorOrder {
  _id: string;
  customerId?: {
    name?: string;
    email?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const orderStatuses = [
  "placed",
  "accepted",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

function VendorDashboard() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
  const controller = new AbortController();

  async function fetchMyRestaurant() {
    try {
      const res = await api.get("/restaurants/vendor/me", { signal: controller.signal });
      console.log("Fetched restaurant data:", res.data);
      setRestaurant(res.data);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        console.error("Error fetching restaurant:", err.response?.data || err.message);
        setRestaurant(null);
      }
    } finally {
      setLoading(false);
    }
  }

  fetchMyRestaurant();
  return () => controller.abort();
}, []);

  useEffect(() => {
    if (!restaurant?._id) return;

    const restaurantId = restaurant._id;
    const controller = new AbortController();

    async function fetchOrders() {
      setOrdersLoading(true);
      try {
        const res = await api.get(`/orders/vendor/${restaurantId}`, {
          signal: controller.signal,
        });
        setOrders(res.data || []);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          console.error("Error fetching orders:", err.response?.data || err.message);
        }
      } finally {
        setOrdersLoading(false);
      }
    }

    fetchOrders();
    return () => controller.abort();
  }, [restaurant?._id]);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status });
      setOrders((current) =>
        current.map((order) => (order._id === orderId ? res.data : order))
      );
    } catch (err: any) {
      console.error("Error updating order status:", err.response?.data || err.message);
      alert("Failed to update order status");
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("zaika_token");
    window.location.href = "/";
  };

  if (loading) return <div className="px-4 py-12 text-center text-[#765f55]">Loading...</div>;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl px-4 py-6">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } zaika-card flex flex-col rounded-2xl transition-all duration-300`}
      >
        <div className="flex items-center justify-between border-b border-[#efd9bd] p-4">
          <h1
            className={`text-xl font-black text-[#251611] transition-all duration-300 ${
              !sidebarOpen && "hidden"
            }`}
          >
            Vendor Studio
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-full p-2 text-[#765f55] hover:bg-[#fff1d5]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition ${
              activeSection === "dashboard"
                ? "bg-[#fff1d5] text-[#d9472b] font-bold"
                : "text-[#765f55] hover:bg-[#fff8ed]"
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            {sidebarOpen && "Dashboard Overview"}
          </button>

          <button
            onClick={() => setActiveSection("manageDishes")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition ${
              activeSection === "manageDishes"
                ? "bg-[#fff1d5] text-[#d9472b] font-bold"
                : "text-[#765f55] hover:bg-[#fff8ed]"
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" />
            {sidebarOpen && "Manage Dishes"}
          </button>

          <button
            onClick={() => setActiveSection("orders")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition ${
              activeSection === "orders"
                ? "bg-[#fff1d5] text-[#d9472b] font-bold"
                : "text-[#765f55] hover:bg-[#fff8ed]"
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            {sidebarOpen && "Orders"}
          </button>

          <button
            onClick={() => {
              setActiveSection("profile");
              setIsEditingProfile(false);
            }}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition ${
              activeSection === "profile"
                ? "bg-[#fff1d5] text-[#d9472b] font-bold"
                : "text-[#765f55] hover:bg-[#fff8ed]"
            }`}
          >
            <User className="w-5 h-5" />
            {sidebarOpen && "Vendor Profile"}
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 border-t border-[#efd9bd] px-4 py-3 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && "Logout"}
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto px-0 py-0 md:px-6">
        {activeSection === "dashboard" && (
          <section>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d9472b]">
              Vendor Studio
            </p>
            <h2 className="mb-4 mt-1 text-3xl font-black text-[#251611]">
              Dashboard Overview
            </h2>
            {!restaurant ? (
              <RestaurantForm onSuccess={setRestaurant} />
            ) : (
              <div className="zaika-card rounded-2xl p-6">
                <h3 className="mb-2 text-2xl font-black text-[#251611]">
                  {restaurant.name}
                </h3>
                <p className="mb-4 text-[#765f55]">{restaurant.description}</p>
                <p className="text-sm font-semibold text-[#765f55]">
                  Cuisine:{" "}
                  {restaurant.cuisine?.length
                    ? restaurant.cuisine.join(", ")
                    : "N/A"}
                </p>
                <p className="text-sm font-semibold text-[#765f55]">
                  Rating: {restaurant.rating || "Not rated yet"}
                </p>
              </div>
            )}
          </section>
        )}

        {activeSection === "manageDishes" && (
          <section>
            <h2 className="mb-4 text-3xl font-black text-[#251611]">Manage Dishes</h2>
            {restaurant ? (
              <DishForm restaurantId={restaurant._id} />
            ) : (
              <p className="text-[#765f55]">Please register your restaurant first.</p>
            )}
          </section>
        )}

        {activeSection === "orders" && (
          <section>
            <h2 className="mb-4 text-3xl font-black text-[#251611]">Orders Received</h2>
            {ordersLoading ? (
              <div className="zaika-card rounded-2xl p-6 text-[#765f55]">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="zaika-card rounded-2xl p-6 text-[#765f55]">
                <p>No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="zaika-card rounded-2xl p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-black text-[#251611]">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h3>
                        <p className="text-sm text-[#765f55]">
                          {order.customerId?.name || "Customer"}{" "}
                          {order.customerId?.email ? `(${order.customerId.email})` : ""}
                        </p>
                        <p className="text-sm text-[#765f55]">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <select
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(order._id, event.target.value)
                        }
                        className="zaika-input max-w-48 text-sm"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <ul className="mt-4 divide-y divide-[#efd9bd]">
                      {order.items.map((item, index) => (
                        <li
                          key={item._id || `${order._id}-${index}`}
                          className="flex justify-between py-2 text-sm text-[#765f55]"
                        >
                          <span>
                            {item.name || "Dish"} x {item.quantity}
                          </span>
                          <span>₹{(item.price || 0) * item.quantity}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-3 text-right font-black text-[#251611]">
                      Total: ₹{order.totalAmount}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeSection === "profile" && (
          <section>
            <h2 className="mb-4 text-3xl font-black text-[#251611]">Vendor Profile</h2>
            {!restaurant ? (
              <RestaurantForm onSuccess={setRestaurant} />
            ) : isEditingProfile ? (
              <RestaurantForm
                mode="edit"
                initialRestaurant={restaurant}
                onSuccess={(updatedRestaurant) => {
                  setRestaurant(updatedRestaurant);
                  setIsEditingProfile(false);
                }}
                onCancel={() => setIsEditingProfile(false)}
              />
            ) : (
              <div className="zaika-card space-y-3 rounded-2xl p-6 text-[#765f55]">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {restaurant.name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Cuisine:</span>{" "}
                  {restaurant.cuisine?.length
                    ? restaurant.cuisine.join(", ")
                    : "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {[restaurant.address?.street, restaurant.address?.city]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Opening Hours:</span>{" "}
                  {restaurant.openingHours || "N/A"}
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="zaika-button mt-4 px-4 py-2"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default withAuth(VendorDashboard, "vendor");
