import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MenuCard from "./MenuCard";
import Shimmer from "./Shimmer";

export default function RestaurantMenu() {
  const { id } = useParams();
  const [selected, setSelected] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("Restaurant ID not found in URL.");
      setLoading(false);
      return;
    }

    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        const restaurantId = id.toString().replace(/\D/g, '');
        if (!restaurantId) {
          throw new Error("Invalid restaurant ID");
        }

        const proxy = "https://cors-anywhere.herokuapp.com/";
        const apiUrl = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=12.9715987&lng=77.5945627&restaurantId=${restaurantId}`;

        const response = await fetch(proxy + apiUrl, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Invalid response: ${text.slice(0, 100)}...`);
        }

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Full Swiggy API response:", data);

        let menuSections = [];

        if (data?.data?.cards?.[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards) {
          menuSections = data.data.cards[4].groupedCard.cardGroupMap.REGULAR.cards;
        } else if (data?.data?.cards?.[5]?.groupedCard?.cardGroupMap?.REGULAR?.cards) {
          menuSections = data.data.cards[5].groupedCard.cardGroupMap.REGULAR.cards;
        } else {
          const menuContainer = data?.data?.cards?.find(
            card => card?.groupedCard?.cardGroupMap?.REGULAR?.cards
          );
          if (menuContainer) {
            menuSections = menuContainer.groupedCard.cardGroupMap.REGULAR.cards;
          }
        }

        if (!menuSections || menuSections.length === 0) {
          throw new Error("Menu data not found in response");
        }

        const filterData = menuSections.filter(
          section => section?.card?.card?.title
        );

        if (filterData.length === 0) {
          throw new Error("No menu sections found");
        }

        setMenuData(filterData);
      } catch (err) {
        console.error("🛑 Error fetching menu 🛑", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  if (loading) {
    return <Shimmer />;
  }

  if (error) {
    return (
      <div className="text-center mt-20 p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Menu</h2>
        <p className="text-gray-700 mb-2">{error}</p>
        <p className="text-sm text-gray-500 mb-4">Restaurant ID: {id || "Not provided"}</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mr-2"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
        <Link 
          to="/" 
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 🔍 Search Button - Swiggy Style */}
      <div className="w-[80%] mx-auto mt-16 mb-10">
        <Link to={`/city/delhi/${id}/search`}>
          <p className="w-full text-center py-3 rounded-full bg-gray-100 hover:bg-orange-100 text-xl font-semibold text-gray-800 shadow-md transition duration-200">
            🔍 Search for Dishes
          </p>
        </Link>
      </div>

      {/* 🥦 Veg/Non-Veg Filter Buttons */}
      <div className="w-[80%] mx-auto mb-10 flex items-center gap-4">
        <button
          className={`px-5 py-2 rounded-full font-medium border transition duration-200 shadow-sm ${
            selected === "veg"
              ? "bg-green-600 text-white border-green-700"
              : "bg-white text-green-700 border-green-400 hover:bg-green-50"
          }`}
          onClick={() => setSelected(selected === "veg" ? null : "veg")}
        >
          🥦 Veg
        </button>

        <button
          className={`px-5 py-2 rounded-full font-medium border transition duration-200 shadow-sm ${
            selected === "nonveg"
              ? "bg-red-600 text-white border-red-700"
              : "bg-white text-red-700 border-red-400 hover:bg-red-50"
          }`}
          onClick={() => setSelected(selected === "nonveg" ? null : "nonveg")}
        >
          🍗 Non-Veg
        </button>
      </div>

      {/* 🍽️ Menu Cards */}
      <div className="w-[80%] mx-auto">
        {menuData.map((section) => (
          <MenuCard
            key={section?.card?.card?.title}
            menuItems={section?.card?.card}
            foodselected={selected}
          />
        ))}
      </div>
    </div>
  );
}
