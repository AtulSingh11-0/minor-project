import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar/NavBar";
import HomeLandingPage from "./Pages/HomeLandingPage";
import Login from "./Pages/Login";
import Registration from "./Pages/Registretion";
import Home from "./Pages/Home";
import MedicineSearch from "./Pages/MedicineSearch";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import PrescriptionUpload from "./Pages/PrescriptionUpload";
import Orders from "./Pages/Orders";
import AdminHome from "./Pages/Admin/AdminHome";
import ProtectedRoute from "./Components/ProtectedRoute";
import OrderManagement from "./Pages/Admin/OrderManagement";
import OrderDetails from "./Pages/Admin/OrderDetails";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    // Update state when localStorage changes
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setUserRole(localStorage.getItem("userRole"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Function to update login state
  const updateLoginState = () => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    setUserRole(localStorage.getItem("userRole"));
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        updateLoginState={updateLoginState}
      />
      <Routes>
        {/* Public Routes */}
        {!isLoggedIn && (
          <>
            <Route
              path="/login"
              element={<Login updateLoginState={updateLoginState} />}
            />
            <Route path="/register" element={<Registration />} />
          </>
        )}
        <Route path="/Medicine-search" element={<MedicineSearch />} />

        {/* User Routes */}
        {userRole === "user" && (
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route
                path="/upload-prescription/:id"
                element={<PrescriptionUpload />}
              />
            </Route>
          </>
        )}

        {/* Admin Routes */}
        {userRole === "admin" && (
          <>
            <Route path="/" element={<Navigate to="/admin-home" />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin-home" element={<AdminHome />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/orders/:orderId" element={<OrderDetails />} />
            </Route>
          </>
        )}

        {/* Default Landing Page */}
        {!isLoggedIn && <Route path="/" element={<HomeLandingPage />} />}

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
