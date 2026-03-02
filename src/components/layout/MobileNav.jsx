import {
  Bell,
  FileText,
  Key,
  LayoutDashboard,
  Smartphone,
  User,
  Users,
  X,
  LogOut,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getNavItems } from '../../utils/permissionHelpers';

const iconMap = {
  LayoutDashboard,
  Bell,
  User,
  Smartphone,
  Key,
  Users,
  FileText,
};

function MobileNav({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navItems = getNavItems(user?.role);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 md:hidden" role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform dark:bg-gray-900">
        <div className="h-16 border-b border-gray-200 px-4 flex items-center justify-between dark:border-gray-800">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Smart Access</h1>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-3 dark:border-gray-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
