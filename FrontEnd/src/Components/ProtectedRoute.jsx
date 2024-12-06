import React from "react";
import { useAuth } from "../Hooks/AuthCheck";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  console.log("protectted route", isLoggedIn);
  
  return isLoggedIn === "true" ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
