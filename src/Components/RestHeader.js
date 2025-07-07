import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaTag, FaQuestionCircle, FaUser, FaShoppingBag } from "react-icons/fa";

export default function RestHeader() {
  const counter = useSelector((state) => state.cartslice.count);

  return (
    <div className="w-full bg-white shadow-md sticky top-0 z-50 px-8 py-4">
      <div className="flex justify-between items-center">
        {/* Left: Logo + Location */}
        <div className="flex items-center space-x-4">
          <img
            src="https://w7.pngwing.com/pngs/47/533/png-transparent-swiggy-office-business-online-food-ordering-delivery-bangalore-business-food-text-orange-thumbnail.png"
            alt="Swiggy"
            className="w-8 h-8 object-contain"
          />

          <div className="text-sm text-gray-800 font-medium truncate max-w-[220px]">
            <span className="font-semibold text-black">Other</span>{" "}
            Block P, Mohan Garden, Razapur Kh...
          </div>
        </div>

        {/* Right: Navigation */}
        <div className="flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Link to="/corporate" className="hover:text-orange-500 transition">
            Swiggy Corporate
          </Link>
          <Link to="/offers" className="flex items-center hover:text-orange-500 transition">
            <FaTag className="mr-1 text-orange-500" />
            Offers
          </Link>
          <Link to="/help" className="flex items-center hover:text-orange-500 transition">
            <FaQuestionCircle className="mr-1" />
            Help
          </Link>
          <Link to="/signin" className="flex items-center hover:text-orange-500 transition">
            <FaUser className="mr-1" />
            Sign In
          </Link>
          <Link to="/checkout" className="flex items-center hover:text-orange-500 transition">
            <FaShoppingBag className="mr-1" />
            Cart {counter > 0 && `(${counter})`}
          </Link>
        </div>
      </div>
    </div>
  );
}
