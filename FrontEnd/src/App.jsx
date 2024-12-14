import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Navbar from "./Components/Navbar/NavBar";
import HomeLandingPage from "./Pages/HomeLandingPage";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import Home from "./Pages/Home";
import MedicineSearch from "./Pages/MedicineSearch";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import PrescriptionUpload from "./Pages/PrescriptionUpload";
import Orders from "./Pages/Orders";
import AdminHome from "./Pages/Admin/AdminHome";
import OrderManagement from "./Pages/Admin/OrderManagement";
import OrderDetails from "./Pages/Admin/OrderDetails";
import ProtectedRoute from "./Components/ProtectedRoute";
import MedicineManagement from "./Pages/Admin/MedicineManagement";
import CheckPrescription from './Pages/Admin/CheckPrescription';
import PendingPrescriptionsList from './Pages/Admin/PendingPrescriptionsList';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeLandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/medicine-search" element={<MedicineSearch />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/upload-prescription/:id" element={<PrescriptionUpload />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin-home" element={<AdminHome />} />
            <Route path="/admin/orders/:orderId" element={<OrderDetails />} />
            <Route path="/admin/medicines" element={<MedicineManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/check-prescriptions/:orderId" element={<CheckPrescription />} />
            <Route path="/admin/check-prescriptions" element={<PendingPrescriptionsList />} />
          </Route>
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;