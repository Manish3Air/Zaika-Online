import RestaurantCard from "./components/RestaurantCard";

async function fetchRestaurants() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/restaurants`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function HomePage() {
  const restaurants = await fetchRestaurants();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Discover Great Food Near You</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {restaurants.map((r: any) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  );
}
