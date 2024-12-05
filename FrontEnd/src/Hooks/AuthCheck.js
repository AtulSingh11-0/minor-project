import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check auth status on mount and token changes
  const checkAuthStatus = () => {
    const token = localStorage.getItem("jwt");
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
    localStorage.setItem("jwt", token);
    setIsAuthenticated(true);
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem("jwt");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return { isAuthenticated, login, logout };
};
