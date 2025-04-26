import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaLock, 
  FaChartLine, 
  FaInfoCircle, 
  FaChevronDown, 
  FaChevronRight,
  FaShieldAlt,
  FaDatabase
} from 'react-icons/fa';

const SidebarLogo = () => {
  return (
    <div className="flex items-center gap-2 px-6 py-4 mb-6">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary rounded-lg">
        <FaShieldAlt className="text-white text-xl" />
      </div>
      <span className="text-xl font-semibold text-bodydark1">
        PrivacyApp
      </span>
    </div>
  );
};

const SidebarNavGroup = ({ children, title }) => {
  return (
    <div>
      <h3 className="mb-4 ml-4 text-sm font-medium text-bodydark2 uppercase">
        {title}
      </h3>
      <ul className="mb-6 flex flex-col gap-1.5">{children}</ul>
    </div>
  );
};

const SidebarNavItem = ({ icon: Icon, path, label, children, isActive }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = children && children.length > 0;

  return (
    <li>
      {!hasChildren ? (
        <Link
          to={path}
          className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
        >
          <Icon className={`text-lg ${isActive ? 'text-white' : ''}`} />
          {label}
        </Link>
      ) : (
        <>
          <button
            onClick={() => setOpen(!open)}
            className={`sidebar-dropdown-button ${isActive || open ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`text-lg ${isActive ? 'text-white' : ''}`} />
              {label}
            </div>
            {open ? (
              <FaChevronDown className="text-sm" />
            ) : (
              <FaChevronRight className="text-sm" />
            )}
          </button>
          {open && (
            <div className="sidebar-submenu">
              {children.map((child, index) => (
                <Link
                  key={index}
                  to={child.path}
                  className={`sidebar-submenu-item ${
                    child.isActive ? 'active' : ''
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </li>
  );
};

const TailAdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      icon: FaChartLine,
      path: '/',
      label: 'Data Input',
    },
    {
      icon: FaLock,
      path: '/privacy',
      label: 'Privacy Info',
    },
    {
      icon: FaInfoCircle,
      path: '/about',
      label: 'About',
    },
    {
      icon: FaDatabase,
      label: 'Data Management',
      children: [
        {
          path: '/data/visualization',
          label: 'Visualization',
          isActive: pathname === '/data/visualization',
        },
        {
          path: '/data/export',
          label: 'Export Data',
          isActive: pathname === '/data/export',
        },
      ],
    },
  ];

  return (
    <aside
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <SidebarLogo />

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* Sidebar Header */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Sidebar Menu */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <SidebarNavGroup title="Menu">
            {navItems.map((item, index) => (
              <SidebarNavItem
                key={index}
                icon={item.icon}
                path={item.path}
                label={item.label}
                children={item.children}
                isActive={pathname === item.path}
              />
            ))}
          </SidebarNavGroup>
        </nav>
        {/* Sidebar Menu */}
      </div>
    </aside>
  );
};

export default TailAdminSidebar;
