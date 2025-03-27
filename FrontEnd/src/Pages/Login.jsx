import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import api from "../Apis/Api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post("auth/login", { email, password });

      if (!response.data?.data?.token) {
        throw new Error("Authentication token missing from response");
      }

      const token = response.data.data.token;
      const userRole = response.data.data.user.role;

      // Use context login function
      login(token, userRole);

      // Redirect based on role
      navigate(userRole === "admin" ? "/admin-home" : "/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <img
        src="https://img.freepik.com/free-vector/abstract-background-with-hexagons_23-2148995949.jpg"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      
      <div className="relative z-10 w-full max-w-md">
        {/* User Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500 rounded-full p-4 w-24 h-24 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        {/* Login Form */}
        <div className=" rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}
            
            {/* Email Input */}
            <div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-10 h-10 text-white px-2 bg-blue-500 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clipRule="evenodd"
                  />
                </svg>

                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-gray-700 bg-blue-200 placeholder-gray-600 focus:placeholder-white focus:outline-none focus:bg-blue-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-10 h-10 text-white px-2 bg-blue-500 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                    clipRule="evenodd"
                  />
                </svg>

                <input
                  type="password"
                  id="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-gray-700 bg-blue-200 placeholder-gray-600 focus:placeholder-white focus:outline-none focus:bg-blue-400"
                />
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex sm:flex-row justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center pt-3">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 text-white text-lg font-semibold rounded bg-blue-600 hover:bg-blue-500 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {/* Register Link */}
            <div className="flex sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 space-x-1 justify-center items-center">
              <p className="text-center sm:text-left">Don't have an account?</p>
              <Link to="/register" className="text-blue-700 text-center pb-2">
                Register Now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;