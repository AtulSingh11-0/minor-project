import React from "react";
import { Link } from "react-router-dom";
import bg1 from "../../public/bg1.png";

const HomeLandingPage = () => {
  return (
    <div className="w-full min-h-screen relative bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-gray-800">
      {/* Background Image */}
      <img
        src="https://img.freepik.com/free-vector/abstract-background-with-hexagons_23-2148995949.jpg"
        alt=""
        className="absolute top-0 left-0 w-full h-full object-cover z-0 "
      />
      {/* Main Content */}
      <main className="text-center md:px-6 md:pt-20  animate-fadeIn">
        {/* Animated Image */}
        <img
          src={bg1}
          alt=""
          className="w-72 m-auto transform -translate-y-20 opacity-0 animate-fadeInImage"
        />
        <h1 className="text-2xl md:text-5xl font-extrabold text-blue-700 mb-6">
          Welcome to Our Online Medicine Shop
        </h1>
        <p className="text-lg text-gray-600 mb-8 px-2">
          Discover amazing products at great prices! Not logged in yet? Join us
          today.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            to="/login"
            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-500 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 bg-teal-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-orange-500 transition duration-300"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomeLandingPage;
