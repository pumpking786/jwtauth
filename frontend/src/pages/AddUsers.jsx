import React, { useState } from 'react';
import Axios from 'axios';  // Import Axios to send HTTP requests

const AddUser = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that email, name, and age are provided
    if (!email || !name || !age) {
      setError("All fields are required!");
      setMessage(null);
      return;
    }

    const data = { email, name, age };

    try {
      // Send POST request to the backend to add the user
      const response = await Axios.post("http://localhost:8000/adduser", data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT stored in localStorage
        }
      });

      // If successful, set success message and clear the error
      setMessage(response.data.message);  // Assuming the backend sends a success message
      setError(null);
      
      // Optionally reset the form after submission
      setEmail('');
      setName('');
      setAge('');
      
    } catch (err) {
      // Handle errors (e.g., validation or server errors)
      setError(err?.response?.data || "An error occurred. Please try again.");
      setMessage(null);  // Clear success message if there's an error
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-gray-300 shadow-md rounded-md border border-gray-500">
      <h2 className="text-xl font-semibold mb-4 text-center">Add User</h2>

      {/* Display error or success messages */}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {message && <div className="mb-4 text-green-500">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md cursor-pointer">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;

