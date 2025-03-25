import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

function Header() {
  return (
    <>
      <header className="flex justify-between items-center p-4 bg-gray-600 text-white shadow-md rounded-md">
  {/* Left side - Name */}
  <div className="text-2xl font-bold tracking-wide ml-8">Connections</div>

  {/* Right side - Sign In and Login buttons */}
  <div className="flex space-x-6 mr-8">
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
  </div>
</header>

    </>
  );
}

export default Header;
