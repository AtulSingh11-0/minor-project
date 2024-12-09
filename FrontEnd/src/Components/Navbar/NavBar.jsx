import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Hooks/AuthCheck";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white py-2 px-4 md:px-8 shadow-md">
      <ul className="gap-16">
        {!localStorage.getItem("jwt") && (
          <>
            {/* befor login */}
            <li>
              <Link
                to="/"
                className="font-semibold hover:text-yellow-500 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/Medicine-search"
                className=" font-semibold hover:text-yellow-500 transition-colors"
              >
                Medicines
              </Link>
            </li>

            <li>
              <Link
                to="/login"
                className=" font-semibold hover:text-yellow-500 transition-colors"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className=" font-semibold hover:text-yellow-500 transition-colors"
              >
                Register
              </Link>
            </li>
          </>
        )}

        {localStorage.getItem("jwt") && (
          <div className="flex items-center justify-between py-1 px-4">
            {/* after login */}
            <div className="flex items-center space-x-1">
              <img
                src="https://cdn1.iconfinder.com/data/icons/hygiene-color-outline/64/30-medical_alcohol-512.png"
                alt="Logo"
                className="h-10 w-10 opacity-75"
              />
              <h1 className="text-xl font-bold">MedStore</h1>
            </div>
            <div className="flex gap-16">
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/Medicine-search">Medicines</Link>
              </li>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
            </div>
            <div className="flex gap-10 items-center">
              <li>
                <Link to="/cart">
                  <ShoppingCart size={24} />
                </Link>
              </li>
              <li>
                <button
                  className="px-6 py-2 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition duration-300"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </div>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
