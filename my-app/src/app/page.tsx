import Link from "next/link";
import RestaurantCard from "./components/RestaurantCard";

export const dynamic = "force-dynamic";

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

  if (!base) {
    console.error("NEXT_PUBLIC_API_BASE is not configured.");
    return [];
  }

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
    return Array.isArray(responseData) ? responseData : [];
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    return [];
  }
}

export default async function HomePage() {
  const restaurants = await fetchRestaurants();
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="zaika-card rounded-2xl px-6 py-14 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d9472b]">
            Zaika Online
          </p>
          <h1 className="mt-3 text-4xl font-black text-[#251611]">
            No Restaurants Found
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[#765f55]">
            There was an issue loading restaurants, or none are available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="grid gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d9472b]">
            Fresh from local kitchens
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight text-[#251611] md:text-6xl">
            Discover bold flavors around you.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#765f55]">
            Browse restaurants, explore menus, and find the dishes that match your mood.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/restaurants" className="zaika-button px-6 py-3">
              Browse Restaurants
            </Link>
            <Link
              href="/vendor"
              className="rounded-xl border border-[#efd9bd] bg-[#fffdf8] px-6 py-3 font-bold text-[#251611] transition hover:bg-[#fff1d5]"
            >
              Sell on Zaika
            </Link>
          </div>
        </div>
        <div className="zaika-card overflow-hidden rounded-2xl">
          <img
            src={restaurants[0]?.logoUrl || "/placeholder.jpg"}
            alt={restaurants[0]?.name || "Featured restaurant"}
            className="h-80 w-full object-cover"
          />
          <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d9472b]">
              Featured kitchen
            </p>
            <h2 className="mt-1 text-2xl font-black text-[#251611]">
              {restaurants[0]?.name}
            </h2>
            <p className="mt-2 text-sm text-[#765f55]">
              {restaurants[0]?.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d9472b]">
              Popular choices
            </p>
            <h2 className="mt-1 text-3xl font-black text-[#251611]">
              Restaurants near you
            </h2>
          </div>
          <Link href="/restaurants" className="hidden text-sm font-bold text-[#d9472b] sm:block">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.slice(0, 6).map((r) => (
          <RestaurantCard key={r._id} restaurant={r} />
        ))}
        </div>
      </section>
    </div>
  );
}
