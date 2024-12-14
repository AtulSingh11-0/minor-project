import React from "react";
import { Navigate } from "react-router-dom";

const RedirectIfLoggedIn = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    // If logged in, redirect based on role
    const redirectPath = role === "admin" ? "/admin-home" : "/home";
    return <Navigate to={redirectPath} />;
  }

  // If not logged in, render the children (Login/Registration page)
  return children;
};

export default RedirectIfLoggedIn;
