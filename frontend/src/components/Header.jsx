import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate=useNavigate();

  const token = localStorage.getItem('token'); // Check if token exists in localStorage
  // Check authentication status when the component mounts or whenever the state changes
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true); // Set state to true if token exists
    } else {
      setIsAuthenticated(false); // Set state to false if no token exists
    }
  }, [token]); // The empty dependency array ensures this runs once when the component mounts

  // Handle logout
  const handleLogout = () => {
    // Remove token from localStorage and update the state
    localStorage.removeItem('token');
    setIsAuthenticated(false); // Update the state to reflect the logout
    navigate('/login'); 
  };

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-gray-600 text-white shadow-md rounded-md">
        {/* Left side - Name */}
        <div className="text-2xl font-bold tracking-wide ml-8">Connections</div>

        {/* Right side - Sign In and Login buttons */}
        <div className="flex space-x-6 mr-8">
          {isAuthenticated ? (
            <>
              {/* Show Add users, Profile and Logout when authenticated */}
              <Link
                to="/addusers"
                className="px-6 py-2 bg-white text-green-600 rounded-lg shadow-sm hover:bg-green-500 hover:text-white transition ease-in-out duration-300 transform hover:scale-105"
              >
                Add users
              </Link>
              <Link
                to="/usersdetail"
                className="px-6 py-2 bg-white text-green-600 rounded-lg shadow-sm hover:bg-green-500 hover:text-white transition ease-in-out duration-300 transform hover:scale-105"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2 cursor-pointer bg-white text-green-600 rounded-lg shadow-sm hover:bg-green-500 hover:text-white transition ease-in-out duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Show Sign Up and Login when not authenticated */}
              <Link
                to="/signup"
                className="px-6 py-2 bg-white text-green-600 rounded-lg shadow-sm hover:bg-green-500 hover:text-white transition ease-in-out duration-300 transform hover:scale-105"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-6 py-2 bg-white text-green-600 rounded-lg shadow-sm hover:bg-green-500 hover:text-white transition ease-in-out duration-300 transform hover:scale-105"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
