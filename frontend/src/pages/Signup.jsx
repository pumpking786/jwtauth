import React, { useState } from 'react';
import Axios from 'axios';  // Import Axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook from react-router-dom

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);  // To handle any error that occurs
  const [message, setMessage] = useState(null); // To show success message
  const navigate = useNavigate();  // Initialize the navigate hook 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle signup logic (e.g., form submission)
    
    // Prepare the data to send to the backend
    const data = { username, password };
    
    try {
      // Send POST request to the backend API
      const response = await Axios.post("http://localhost:8000/signup", data);
      
      // Handle success (e.g., show success message)
      setMessage(response.data.message);  // Assuming backend sends a message like "User registered successfully!"
      setError(null);  // Clear any previous error if signup was successful

      // Redirect to the login page after successful signup
      setTimeout(() => {
        navigate('/login'); // Navigate to the login page after a brief delay
      }, 1000); // Delay to show the success message before redirecting (2 seconds)

    } catch (err) {
      // Handle errors (e.g., username already exists, etc.)
      setError(err.response ? err.response.data : "An error occurred. Please try again.");
      setMessage(null);  // Clear any previous success message if there is an error
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-gray-300 shadow-md rounded-md border border-gray-500">
      <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>
      
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
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md cursor-pointer">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
