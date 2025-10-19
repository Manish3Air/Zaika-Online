async function fetchData(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const [restaurant, dishes] = await Promise.all([
    fetch(`${base}/restaurants/${id}`).then((r) => r.json()),
    fetch(`${base}/restaurants/${id}/dishes`).then((r) => r.json()),
  ]);
  return { restaurant, dishes };
}

export default async function RestaurantPage({
  params,
}: {
  params: { id: string };
}) {
  const { restaurant, dishes } = await fetchData(params.id);

  if (!restaurant) return <div>Restaurant not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{restaurant.name}</h1>
      <p className="text-gray-600 mb-6">{restaurant.address}</p>
      <h2 className="text-xl font-semibold mb-3">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dishes.map((d: any) => (
          <div key={d.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{d.name}</h3>
                <p>{d.description}</p>
              </div>
              <span>₹{d.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
