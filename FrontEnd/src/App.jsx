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
import RedirectIfLoggedIn from "./Pages/RedirectIfLoggedIn";
import MedicineManagement from "./Pages/Admin/MedicineManagement";
import PrescriptionApproval from "./Pages/Admin/CheckPrescription";
import PendingPrescriptionsList from "./Pages/Admin/PendingPrescriptionsList";

function App() {
  return (
    <Router>
      {/* Navbar should be outside Routes to show across all pages */}
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <RedirectIfLoggedIn>
              <Login />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfLoggedIn>
              <Registration />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/"
          element={
            <RedirectIfLoggedIn>
              <HomeLandingPage />
            </RedirectIfLoggedIn>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicine-search"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MedicineSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-prescription/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <PrescriptionUpload />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OrderManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:orderId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/medicines"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MedicineManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/check-prescriptions/:orderId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PrescriptionApproval />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/check-prescriptions"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PendingPrescriptionsList />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
