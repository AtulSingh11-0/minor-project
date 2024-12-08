import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const role = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" />; // Redirect to login if not logged in
  }

  if (!allowedRoles.includes(role)) {
    // Redirect based on role
    return <Navigate to={role === "admin" ? "/admin/home" : "/user/home"} />;
  }

  return children; // Render the protected component
};

export default ProtectedRoute;