import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import LoggedInFooter from './LoggedInFooter';

const AuthenticatedLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-60">
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: '#F5F7F9' }}>
          <Outlet />
        </main>
        
        <LoggedInFooter />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
