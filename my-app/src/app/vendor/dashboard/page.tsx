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

function VendorDashboard() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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


  const handleLogout = () => {
    localStorage.removeItem("zaika_token");
    window.location.href = "/";
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-md`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1
            className={`text-xl font-bold text-blue-600 transition-all duration-300 ${
              !sidebarOpen && "hidden"
            }`}
          >
            Vendor Panel
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition ${
              activeSection === "dashboard"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            {sidebarOpen && "Dashboard Overview"}
          </button>

          <button
            onClick={() => setActiveSection("manageDishes")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition ${
              activeSection === "manageDishes"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" />
            {sidebarOpen && "Manage Dishes"}
          </button>

          <button
            onClick={() => setActiveSection("orders")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition ${
              activeSection === "orders"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            {sidebarOpen && "Orders"}
          </button>

          <button
            onClick={() => setActiveSection("profile")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition ${
              activeSection === "profile"
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <User className="w-5 h-5" />
            {sidebarOpen && "Vendor Profile"}
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 border-t text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && "Logout"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeSection === "dashboard" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            {!restaurant ? (
              <RestaurantForm onSuccess={setRestaurant} />
            ) : (
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="text-xl font-semibold mb-2">
                  {restaurant.name}
                </h3>
                <p className="text-gray-600 mb-2">{restaurant.description}</p>
                <p className="text-gray-500 text-sm">
                  Cuisine:{" "}
                  {restaurant.cuisine?.length
                    ? restaurant.cuisine.join(", ")
                    : "N/A"}
                </p>
                <p className="text-gray-500 text-sm">
                  Rating: ⭐ {restaurant.rating || "Not rated yet"}
                </p>
              </div>
            )}
          </section>
        )}

        {activeSection === "manageDishes" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Manage Dishes</h2>
            {restaurant ? (
              <DishForm restaurantId={restaurant._id} />
            ) : (
              <p>Please register your restaurant first.</p>
            )}
          </section>
        )}

        {activeSection === "orders" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Orders Received</h2>
            <div className="bg-white rounded-xl p-6 shadow text-gray-600">
              <p>No orders yet.</p>
            </div>
          </section>
        )}

        {activeSection === "profile" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Vendor Profile</h2>
            <div className="bg-white p-6 rounded-xl shadow space-y-3">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {restaurant?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Cuisine:</span>{" "}
                {restaurant?.cuisine?.length
                  ? restaurant.cuisine.join(", ")
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {restaurant?.address?.street || "N/A"},{" "}
                {restaurant?.address?.city || ""}
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Edit Profile
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default withAuth(VendorDashboard, "vendor");
