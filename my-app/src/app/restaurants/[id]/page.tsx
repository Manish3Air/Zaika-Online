import { Clock, MapPin, Star } from "lucide-react";
import MenuOrderPanel from "../../components/MenuOrderPanel";

async function fetchData(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE;

  if (!base) {
    console.error("NEXT_PUBLIC_API_BASE is not configured.");
    return { restaurant: null, dishes: [] };
  }

  try {
    const [restaurantRes, dishesRes] = await Promise.all([
      fetch(`${base}/restaurants/${id}`, { cache: "no-store" }),
      fetch(`${base}/dishes/restaurants/${id}/dishes`, { cache: "no-store" }),
    ]);

    if (!restaurantRes.ok) {
      throw new Error("Failed to fetch restaurant data");
    }
    if (!dishesRes.ok) {
      throw new Error("Failed to fetch dishes data");
    }

    const [restaurant, dishes] = await Promise.all([
      restaurantRes.json(),
      dishesRes.json(),
    ]);

    return { restaurant, dishes };
  } catch (err) {
    console.error("Error fetching restaurant data:", err);
    return { restaurant: null, dishes: [] };
  }
}

export default async function RestaurantPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const { restaurant, dishes } = await fetchData(id);

  if (!restaurant)
    return (
      <div className="mx-auto flex h-[50vh] max-w-7xl items-center justify-center px-4">
        <p className="zaika-card rounded-2xl px-8 py-6 text-lg font-semibold text-[#765f55]">
          Restaurant not found.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <section className="zaika-card mb-10 overflow-hidden rounded-2xl">
        <div className="relative h-72 bg-[#251611]">
          {restaurant.logoUrl && (
            <img
              src={restaurant.logoUrl}
              alt={restaurant.name}
              className="h-full w-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f4a51c]">
              Zaika kitchen
            </p>
            <h1 className="mt-2 text-4xl font-black md:text-5xl">
              {restaurant.name}
            </h1>
            <p className="mt-3 max-w-3xl text-white/85">
              {restaurant.description}
            </p>
          </div>
        </div>

        <div className="grid gap-4 p-6 text-sm font-semibold text-[#765f55] md:grid-cols-3 md:p-8">
          {restaurant.cuisine?.length > 0 && (
            <p>
              <span className="text-[#251611]">Cuisine:</span>{" "}
              {restaurant.cuisine.join(", ")}
            </p>
          )}
          {restaurant.address && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#d9472b]" />
              {restaurant.address.street}, {restaurant.address.city},{" "}
              {restaurant.address.state} - {restaurant.address.zip}
            </p>
          )}
          <p className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-[#f4a51c] text-[#f4a51c]" />
            {restaurant.rating || "Not rated yet"}
          </p>
          {restaurant.openingHours && (
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#d9472b]" />
              {restaurant.openingHours}
            </p>
          )}
        </div>
      </section>

      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d9472b]">
          Menu
        </p>
        <h2 className="mt-1 text-3xl font-black text-[#251611]">
          Choose your plate
        </h2>
      </div>

      <MenuOrderPanel restaurantId={id} dishes={dishes} />
    </div>
  );
}
