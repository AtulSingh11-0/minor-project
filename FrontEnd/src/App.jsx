import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomeLandingPage from "./Pages/HomeLandingPage";
import Home from "./Pages/Home";
import ProtectedRoute from "./Components/ProtectedRoute";

import Login from "./Pages/Login";
import Registration from "./Pages/Registretion";
import Navbar from "./Components/Navbar/NavBar";
import MedicineSearch from "./Pages/MedicineSearch";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import PrescriptionUpload from "./Pages/PrescriptionUpload";

import Orders from "./Pages/Orders";
import AdminHome from "./Pages/Admin/AdminHome";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        {!localStorage.getItem("jwt") && (
          <>
            <Route path="/" element={<HomeLandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
          </>
        )}

        <Route element={<ProtectedRoute />}>
          <Route path="/register" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Navigate to="/home" />} />

          {localStorage.getItem("userRole") === "admin" ? (
            /// Admin Routes  
            <>
              <Route path="/" element={<AdminHome />} />
              <Route path="*" element={<Navigate to={"/"} />} />
            </>
          ) : (
            /// User Routes
            <>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/Medicine-search" element={<MedicineSearch />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              {/* Fixed dynamic route */}
              <Route
                path="/upload-prescription/:id"
                element={<PrescriptionUpload />}
              />
            </>
          )}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
