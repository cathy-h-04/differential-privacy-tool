import React, { useState, useEffect } from 'react';
import TailAdminSidebar from '../components/TailAdminSidebar';
import TailAdminHeader from '../components/TailAdminHeader';

const TailAdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* Preloader */}
      {loading && (
        <div className="flex h-screen items-center justify-center bg-white">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <TailAdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Sidebar Overlay */}
        <div
          onClick={() => setSidebarOpen(false)}
          className={`fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden ${
            sidebarOpen ? 'block' : 'hidden'
          }`}
        ></div>

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Header */}
          <TailAdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          {/* Main Content */}
          <main className="flex-grow">
            <div className="mx-auto w-full p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TailAdminLayout;
