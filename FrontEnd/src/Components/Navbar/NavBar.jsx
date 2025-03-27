import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { ShoppingCart, Menu, X } from "lucide-react";

const Navbar = () => {
  const { isLoggedIn, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderLogo = () => (
    <div className="text-2xl flex space-x-2 items-center">
      <img 
        src="https://cdn1.iconfinder.com/data/icons/hygiene-color-outline/64/30-medical_alcohol-512.png" 
        alt="MediCare Logo" 
        className="w-7"
      />
      <p>MediCare</p>
    </div>
  );

  const renderMobileMenu = (menuItems) => (
    <div className={`
      ${isMobileMenuOpen ? 'block' : 'hidden'} 
      absolute top-full left-0 w-full bg-blue-500 text-white
      md:hidden z-50`}
    >
      <ul className="flex flex-col items-center space-y-4 py-4">
        {menuItems.map((item, index) => (
          <li 
            key={index} 
            className="w-full text-center flex justify-center items-center"
            onClick={toggleMobileMenu}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderDesktopMenu = (menuItems) => (
    <div className="hidden md:flex space-x-14 text-lg list-none">
      {menuItems.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </div>
  );

  // Render different menus based on login status and user role
  const renderNavbar = () => {
    if (!isLoggedIn) {
      const menuItems = [
        <Link to="/" className="hover:text-blue-200">Home</Link>,
        <Link to="/Medicine-search" className="hover:text-blue-200">Medicines</Link>,
        <Link to="/login" className="hover:text-blue-200">Login</Link>,
        <Link to="/register" className="hover:text-blue-200">Register</Link>
      ];

      return (
        <div className="relative">
          <div className="flex justify-between py-4 items-center bg-blue-500 text-white px-4 md:px-10">
            {renderLogo()}
            
            {/* Mobile Menu Toggle */}

            {renderDesktopMenu(menuItems)}
            <button 
              className="md:hidden" 
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {renderMobileMenu(menuItems)}
        </div>
      );
    }

    if (userRole === "admin") {
      const menuItems = [
        <Link to="/admin-home">Admin Home</Link>,
        <Link to="/admin/medicines">Manage Medicines</Link>,
        <Link to="/admin/orders">View Orders</Link>,
        <Link to="/admin/check-prescriptions">Prescriptions</Link>,
        <button 
          onClick={handleLogout} 
          className="text-blue-600 bg-white hover:bg-blue-600 hover:text-white text-sm px-4 py-2 font-semibold rounded-lg shadow-md transition duration-300"
        >
          Logout
        </button>
      ];

      return (
        <div className="relative">
          <div className="flex justify-between py-4 items-center bg-blue-500 text-white px-4 md:px-10">
            {renderLogo()}
            
            {/* Mobile Menu Toggle */}

            {renderDesktopMenu(menuItems.slice(0, -1))}
            <button 
              className="md:hidden" 
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden md:block">
              {menuItems[menuItems.length - 1]}
            </div>
          </div>
          {renderMobileMenu(menuItems)}
        </div>
      );
    }

    // User menu
    const menuItems = [
      <Link to="/home">Home</Link>,
      <Link to="/Medicine-search">Medicines</Link>,
      <Link to="/orders">Orders</Link>
    ];

    return (
      <div className="relative">
        <div className="flex justify-between py-4 items-center bg-blue-500 text-white px-4 md:px-10">
          {renderLogo()}
          

          {renderDesktopMenu(menuItems)}
          
          <div className="flex items-center space-x-6">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden" 
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
            <Link to="/cart" className="hidden md:flex">
              <ShoppingCart size={24} />
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-blue-600 bg-white hover:bg-blue-600 hover:text-white text-sm px-4 py-2 font-semibold rounded-lg shadow-md transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
        {renderMobileMenu([...menuItems, <Link to="/cart">Cart</Link>])}
      </div>
    );
  };

  return (
    <nav className="font-semibold">
      {renderNavbar()}
    </nav>
  );
};

export default Navbar;