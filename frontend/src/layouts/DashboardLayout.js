import React from 'react';
import { FaLock, FaChartLine, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../dashboard.css';

export default function DashboardLayout({ children }) {
  const menuItems = [
    { name: 'Data Input', icon: FaChartLine, path: '/' },
    { name: 'Privacy Playground', icon: FaLock, path: '/playground' },
    { name: 'About', icon: FaInfoCircle, path: '/about' },
    { name: 'Run Query', icon: FaChartLine, path: '/query' }  // ✅ New
  ];

  return (
    <div className="dashboard-container flex flex-col">
      {/* Top Navbar */}
      <header className="dashboard-header">
        {menuItems.map(item => (
          <Link key={item.name} to={item.path} className="flex items-center mr-6 hover:text-gray-200">
            <item.icon className="inline-block mr-2" />
            {item.name}
          </Link>
        ))}
      </header>

      {/* Main Content */}
      <main className="dashboard-content p-6">
        {children}
      </main>
    </div>
  );
}