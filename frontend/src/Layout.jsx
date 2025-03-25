import React from 'react';
import Header from './components/Header';
function Layout({ children }) {
  return (
    <>
      {/* Add your header here if needed */}
      <Header/>

      {/* Main content */}
      <main className="p-6">
        {children} {/* Render any child components passed to Layout */}
      </main>
    </>
  );
}

export default Layout;
