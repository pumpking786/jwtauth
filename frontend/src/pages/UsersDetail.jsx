import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function UsersDetail() {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await Axios.get("http://localhost:8000/getusers");
      setData(response.data);  // Store the fetched data in the state
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getData();  // Fetch the data on component mount
  }, []);

  return (
    <>
      <h1>User Details</h1>
      {data.length > 0 ? (
        <ul>
          {data.map((user) => (
            <li key={user.id}>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Age: {user.age}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No user data available.</p>
      )}
    </>
  );
}

export default UsersDetail;
