import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout'; // Import your Layout component
import Signup from './pages/Signup';    // Import the Signup component
import Login from './pages/Login';      // Import the Login component
import UsersDetail from './pages/UsersDetail';
import AddUsers from './pages/AddUsers';

function App() {
  return (
    <Router>
      <Routes>
        {/* Add the layout component around your routes */}
        <Route path="/" element={<Layout />}>
          <Route path="/usersdetail" element={<UsersDetail />} />
          <Route path="/addusers" element={<AddUsers />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
