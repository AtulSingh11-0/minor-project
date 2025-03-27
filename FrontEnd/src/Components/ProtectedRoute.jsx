import React from "react";
import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const role = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" />; // Redirect to login if not logged in
  }

  if (!allowedRoles.includes(role)) {
    // Redirect based on role
    return <Navigate to={role === "admin" ? "/admin-home" : "/home"} />;
  }

  return <Outlet />; // Render nested routes
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;