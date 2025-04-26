import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaLock, 
  FaChartLine, 
  FaInfoCircle, 
  FaBars, 
  FaTimes, 
  FaShieldAlt,
  FaUser,
  FaBell,
  FaSearch,
  FaCog
} from 'react-icons/fa';

const NewDashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const navigation = [
    { name: 'Data Input', icon: FaChartLine, path: '/' },
    { name: 'Privacy Info', icon: FaLock, path: '/privacy' },
    { name: 'About', icon: FaInfoCircle, path: '/about' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition duration-300 ease-in-out lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-5 border-b">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 p-2 rounded-lg mr-3">
                <FaShieldAlt className="text-green-600 w-5 h-5" />
              </div>
              {sidebarOpen && (
                <h2 className="text-xl font-medium text-gray-800">Privacy App</h2>
              )}
            </div>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-900 lg:hidden"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            )}
            {!isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-900 hidden lg:block"
              >
                {sidebarOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-green-50 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                  {isActive && sidebarOpen && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-green-500"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          {sidebarOpen && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-green-400 to-green-600 p-2 rounded-md">
                  <FaLock className="text-white h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Privacy Protected</p>
                  <p className="text-xs text-gray-500">Your data is secure</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mr-3"
                >
                  <FaBars className="h-5 w-5" />
                </button>
              )}
              <h1 className="text-lg font-medium text-gray-800">Privacy Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-900 focus:outline-none">
                <FaSearch className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-900 focus:outline-none">
                <FaBell className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-900 focus:outline-none">
                <FaUser className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <div className="mx-auto animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewDashboardLayout;
