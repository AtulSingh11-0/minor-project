import React from "react";
import { useAuth } from "../Hooks/AuthCheck";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return localStorage.getItem("jwt") ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
