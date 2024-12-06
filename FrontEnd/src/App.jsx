import React from "react";
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
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("userRole");
  console.log("app", isLoggedIn);
  console.log("app", userRole);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} />
      <Routes>
        {/* Public Routes */}

        <Route element={<ProtectedRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/Medicine-search" element={<MedicineSearch />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/upload-prescription/:id"
            element={<PrescriptionUpload />}
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/login" element={<Navigate to={"/"} />} />
          <Route path="/register" element={<Navigate to={"/"} />} />
          <Route path="/" element={<Navigate to="/admin-home" />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/orders/:orderId" element={<OrderDetails />} />
          {/* <Route path="*" element={<Navigate to="/admin-home" />} /> */}
        </Route>

        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<HomeLandingPage />} />
        </>
      </Routes>
    </Router>
  );
}

export default App;
