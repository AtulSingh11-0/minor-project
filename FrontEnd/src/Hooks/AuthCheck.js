import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check auth status on mount and token changes
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []); // Empty dependency array - only run on mount

  // Login method
  const login = (token) => {
    if (!token) {
      console.error("No token provided to login");
      return;
    }
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log(
      localStorage.getItem("token"),
      localStorage.getItem("userRole")
    );
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);

    navigate("/login");
    console.log("gone");
  };

  return { isAuthenticated, login, logout };
};