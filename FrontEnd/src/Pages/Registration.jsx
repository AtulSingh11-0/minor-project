import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../Apis/Api";

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous error

    try {
      // Send registration data to the backend
      const response = await api.post("auth/register", {
        name,
        email,
        password,
        phone,
        address,
      });
      console.log("running");
      console.log(response);

      // Extract the token from the response (if needed for future requests)
      const { token } = response.data.data;

      // Store the token in localStorage
      localStorage.setItem("jwt", token);

      // Redirect to the home page after successful registration
      navigate("/home");
    } catch (err) {
      // Handle errors and set the error message
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gray-100 overflow-hidden">
      {/* Background Image */}
      <img
        src="https://img.freepik.com/free-vector/abstract-background-with-hexagons_23-2148995949.jpg"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Register Form */}
      <div className="relative z-10 w-full max-w-xl">
        {/* User Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500 rounded-full p-4 w-24 h-24 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="currentColor"
              className="w-16 h-16 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </div>
        </div>

        {/* Registration Form */}
        <div className="rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <form onSubmit={handleRegister} className="space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Name and Email Input */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Name Input */}
              <div className="flex-1 flex items-center">
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
                  type="text"
                  id="name"
                  value={name}
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-gray-700 bg-blue-200 placeholder-gray-600 focus:placeholder-white focus:outline-none focus:bg-blue-400"
                />
              </div>

              {/* Email Input */}
              <div className="flex-1 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-10 h-10 text-white px-2 bg-blue-500 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.834 6.166a8.25 8.25 0 1 0 0 11.668.75.75 0 0 1 1.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0 1 21.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 1 1-.82-6.26V8.25a.75.75 0 0 1 1.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 0 0-2.416-5.834ZM15.75 12a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0Z"
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
            <div className="md:flex items-center md:space-x-5 space-y-4 md:space-y-0 ">
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
              
              <div className="flex-1 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-10 h-10 text-white px-2 bg-blue-500 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  placeholder="Phone"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-gray-700 bg-blue-200 placeholder-gray-600 focus:placeholder-white focus:outline-none focus:bg-blue-400"
                />
              </div>
            </div>

            {/* Phone and Address Input */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Phone Input */}

              {/* Address Input */}
              <div className="flex-1 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-10 h-10 text-white px-2 bg-blue-500 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  id="address"
                  value={address}
                  placeholder="Address"
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-gray-700 bg-blue-200 placeholder-gray-600 focus:placeholder-white focus:outline-none focus:bg-blue-400"
                />
              </div>
            </div>

            {/* Login Link and Register Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <p>Already have an account?</p>
                <Link to="/login" className="text-blue-700">Login</Link>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 text-white text-md font-semibold rounded bg-blue-600 hover:bg-blue-500 transition-colors"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;