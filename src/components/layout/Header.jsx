import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Menu, Moon, Sun, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../notifications/NotificationBell';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/devices': 'Devices',
  '/access': 'Access Management',
  '/logs': 'Logs',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/admin/users': 'Users Management',
};

function Header({ onOpenMobileNav }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const shouldUseDark =
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', shouldUseDark);
    setIsDarkMode(shouldUseDark);
  }, []);

  useEffect(() => {
    setOpenDropdown(false);
  }, [location.pathname]);

  const toggleDarkMode = () => {
    const nextIsDark = !isDarkMode;
    document.documentElement.classList.toggle('dark', nextIsDark);
    localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
    setIsDarkMode(nextIsDark);
  };

  const pageTitle = useMemo(
    () => pageTitles[location.pathname] || 'Smart Access Control',
    [location.pathname]
  );

  const initial = (user?.fullName || user?.email || 'U').trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 md:text-lg">
            {pageTitle}
          </h2>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <NotificationBell />

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white dark:bg-blue-500">
                {initial}
              </span>
              <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-200 sm:inline">
                {user?.fullName || user?.email || 'User'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {openDropdown ? (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
