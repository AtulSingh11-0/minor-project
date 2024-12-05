import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../Hooks/AuthCheck";
import AuthNavbar from "../Navbar/NavBar";



const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? <AuthNavbar/> : null}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
