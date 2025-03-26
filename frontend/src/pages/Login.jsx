import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { username, password };

    try {
      // Send POST request to the backend API
      const response = await Axios.post("http://localhost:8000/login", data);
      
      // Handle success
      setMessage(response.data.message); // Assuming backend sends a message like "Login Successful"
      setError(null);  // Clear any previous error if login was successful

      // Store the token in localStorage or sessionStorage for later use
      localStorage.setItem("token", response.data.token);

      // Redirect to the dashboard or another page
      setTimeout(() => {
        navigate('/addusers'); // Redirect to addusers page after a brief delay
      }, 1000);

    } catch (err) {
      // Handle errors
      setError(err.response ? err.response.data : "An error occurred. Please try again.");
      setMessage(null);  // Clear any previous success message if there is an error
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-gray-300 shadow-md rounded-md border border-gray-500">
      <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

      {/* Display error or success messages */}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {message && <div className="mb-4 text-green-500">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md cursor-pointer">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
