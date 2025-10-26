import Image from "next/image";

async function fetchData(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE;

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
  const { id } = await props.params; // ✅ await params first
  const { restaurant, dishes } = await fetchData(id);

  if (!restaurant)
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-gray-600 text-lg">❌ Restaurant not found.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Restaurant Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 bg-white shadow-md p-6 rounded-xl">
        {restaurant.logoUrl && (
          <Image
            src={restaurant.logoUrl}
            alt={restaurant.name}
            width={120}
            height={120}
            className="rounded-lg object-cover border"
          />
        )}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
          <p className="text-gray-600 mt-1">{restaurant.description}</p>

          {restaurant.cuisine?.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              🍽️ Cuisine: {restaurant.cuisine.join(", ")}
            </p>
          )}

          {restaurant.address && (
            <p className="mt-1 text-sm text-gray-500">
              📍 {restaurant.address.street}, {restaurant.address.city},{" "}
              {restaurant.address.state} - {restaurant.address.zip}
            </p>
          )}

          <div className="mt-2 text-sm text-yellow-500 font-medium">
            ⭐ {restaurant.rating || "Not rated yet"}
          </div>
        </div>
      </div>

      {/* Dishes Section */}
      <h2 className="text-2xl font-semibold mb-4">Menu</h2>

      {dishes.length === 0 ? (
        <p className="text-gray-500">No dishes available for this restaurant.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish: any) => (
            <div
              key={dish._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {dish.imageUrl && (
                <Image
                  src={dish.imageUrl}
                  alt={dish.name}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {dish.name}
                  </h3>
                  <span className="text-sm font-medium text-gray-700">
                    ₹{dish.price}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {dish.description || "No description provided."}
                </p>

                <div className="mt-2 flex items-center space-x-2 text-sm">
                  {dish.isVeg ? (
                    <span className="text-green-600">🌱 Veg</span>
                  ) : (
                    <span className="text-red-600">🍗 Non-Veg</span>
                  )}
                  {dish.category && (
                    <span className="text-gray-500">• {dish.category}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
