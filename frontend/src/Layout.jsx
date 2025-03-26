import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header'; // Assuming you have a Header component

function Layout() {
  return (
    <div>
      <Header /> {/* This renders your header */}
      <main>
        <Outlet /> {/* This is where the routed components (e.g., Login, Signup) will be rendered */}
      </main>
    </div>
  );
}

export default Layout;
