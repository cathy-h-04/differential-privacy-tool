import React from 'react';
import { FaBars, FaBell, FaSearch, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const DropdownItem = ({ icon: Icon, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3.5 py-2 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary"
    >
      <Icon className="text-lg" />
      {text}
    </button>
  );
};

const TailAdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const trigger = React.useRef(null);
  const dropdown = React.useRef(null);

  // close on click outside
  React.useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  React.useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white shadow-default dark:bg-boxdark">
      <div className="flex flex-grow items-center justify-between py-4 px-4 md:px-6">
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile hamburger button */}
          <button
            aria-controls="sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
          >
            <FaBars className="text-xl" />
          </button>
        </div>

        {/* Search bar */}
        <div className="hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 rounded-md border border-stroke pl-10 pr-4 py-2 focus:outline-none dark:border-strokedark dark:bg-boxdark"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <FaSearch className="text-gray-500" />
            </span>
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* Notification dropdown */}
          <div className="relative">
            <button className="flex h-8.5 w-8.5 items-center justify-center rounded-full border-stroke bg-gray-100 hover:text-primary dark:border-strokedark dark:bg-boxdark">
              <FaBell className="text-lg" />
              <span className="absolute -top-0.5 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-meta-1 text-xs text-white">
                2
              </span>
            </button>
          </div>

          {/* User dropdown */}
          <div className="relative">
            <button
              ref={trigger}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2"
            >
              <span className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-stroke dark:border-strokedark dark:bg-boxdark">
                <FaUser className="text-lg" />
              </span>
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">
                  UserData Analyst
                </span>
              </span>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                ref={dropdown}
                className="dropdown w-62.5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
              >
                <ul className="border-b border-stroke px-1 py-2 dark:border-strokedark">
                  <li>
                    <DropdownItem
                      icon={FaUser}
                      text="My Profile"
                      onClick={() => setDropdownOpen(false)}
                    />
                  </li>
                  <li>
                    <DropdownItem
                      icon={FaCog}
                      text="Account Settings"
                      onClick={() => setDropdownOpen(false)}
                    />
                  </li>
                </ul>
                <button className="flex items-center gap-3.5 py-2 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary">
                  <FaSignOutAlt className="text-lg" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TailAdminHeader;
