import React, { useState } from 'react';
import { FaLock, FaChartLine, FaInfoCircle, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { name: 'Data Input', icon: FaChartLine, path: '/' },
    { name: 'Privacy Info', icon: FaLock, path: '/privacy' },
    { name: 'About', icon: FaInfoCircle, path: '/about' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h1 className="text-xl font-bold text-gray-900">Privacy Dashboard</h1>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900">Privacy Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">Protect your financial data</p>
            </div>
            
            <nav className="flex-1 px-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                >
                  <item.icon className="text-green-600 mr-3" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Privacy Level: <span className="font-semibold text-green-600">High</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 