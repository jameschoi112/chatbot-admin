import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, activeMenu = 'dashboard' }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeMenu={activeMenu} />

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;