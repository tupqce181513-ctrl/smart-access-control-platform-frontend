import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Bell,
  FileText,
  Key,
  LayoutDashboard,
  Smartphone,
  User,
  Users,
} from 'lucide-react';
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

function Sidebar() {
  const { user, logout } = useAuth();
  const navItems = getNavItems(user?.role);

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:flex">
      <div className="h-16 border-b border-gray-200 px-5 flex items-center dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Smart Access
        </h1>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;

          return (
            <NavLink
              key={item.path}
              to={item.path}
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

      <div className="border-t border-gray-200 p-3 dark:border-gray-800">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
