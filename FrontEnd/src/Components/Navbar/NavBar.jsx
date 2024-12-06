import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Hooks/AuthCheck";

const Navbar = ({ isLoggedIn, userRole, updateLoginState }) => {
  const { logout: authLogout } = useAuth();

  const handleLogout = () => {
    authLogout();
    updateLoginState();
  };

  return (
    <nav>
      <ul>
        {/* Before Login */}
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Medicine-search">Medicines</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        ) : userRole === "admin" ? (
          // Admin Navbar
          <>
            <li>
              <Link to="/admin-home">Admin Home</Link>
            </li>
            <li>
              <button
                style={{
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "inherit",
                  padding: "0",
                  font: "inherit",
                }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          // User Navbar
          <>
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
                  padding: "0",
                  font: "inherit",
                }}
                onClick={handleLogout}
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
