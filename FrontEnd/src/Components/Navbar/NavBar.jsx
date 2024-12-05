import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Hooks/AuthCheck";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav>
      <ul>
        {!localStorage.getItem("jwt") && (
          <>
            {/* befor login */}
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/Medicine-search">Medicines</Link>
            </li>

            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">register</Link>
            </li>
          </>
        )}

        {localStorage.getItem("jwt") && (
          <>
            {/* after login */}
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/Medicine-search">Medicines</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            <li>
              <button
                style={{
                  cursor: "pointer",
                }}
                onClick={logout}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
