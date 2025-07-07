import { useEffect, useState } from "react";

export default function SearchAnyDish() {
  const [query, setQuery] = useState("");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lat = 28.7041, lng = 77.1025;
  const proxy = "https://api.allorigins.win/raw?url=";

  useEffect(() => {
    if (query.trim().length < 2) {
      setDishes([]);
      setError("");
      return;
    }
    const t = setTimeout(() => search(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  async function search(term) {
    setLoading(true);
    setError("");
    try {
      const url = `https://www.swiggy.com/dapi/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${encodeURIComponent(term)}`;
      const resp = await fetch(proxy + encodeURIComponent(url));
      const json = await resp.json();

      const dishCards =
        json?.data?.cards
          ?.find(c => c?.groupedCard?.cardGroupMap?.DISH)
          ?.groupedCard?.cardGroupMap?.DISH?.cards || [];

      const items = dishCards
        .map(c => c?.card?.card?.info)
        .filter(info => info && info.name)
        .map(info => ({
          id: info.id,
          name: info.name,
          price: info.price || info.defaultPrice || 0,
          restaurant: info.restaurantName || "Unknown",
          desc: info.description,
          imageId: info.imageId,
          isVeg: info.itemAttribute?.vegClassifier === "VEG"
        }));

      setDishes(items);
    } catch (err) {
      setError("Search failed. Try again?");
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Search Any Dish</h2>
      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Search dishes (e.g. 'Spicy Chicken Burger')"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {loading && <p>Searching dishes...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="space-y-4 mt-4">
        {dishes.map(item => (
          <div key={item.id} className="flex items-center border rounded p-3">
            <div className="flex-1">
              <p className="font-semibold flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-sm ${item.isVeg ? 'bg-green-600' : 'bg-red-600'} inline-block`}
                />
                {item.name}
              </p>
              <p className="text-gray-600">₹{item.price / 100}</p>
              {item.desc && <p className="text-xs text-gray-500">{item.desc}</p>}
              <p className="text-xs text-gray-400">From: {item.restaurant}</p>
            </div>
            {item.imageId && (
              <img
                src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_100,h_100,c_fit/${item.imageId}`}
                alt={item.name}
                className="w-20 h-20 rounded object-cover"
                onError={e => (e.target.style.display = 'none')}
              />
            )}
          </div>
        ))}
        {!loading && query.length >= 2 && dishes.length === 0 && (
          <p>No dishes found matching "{query}"</p>
        )}
      </div>
    </div>
  );
}
