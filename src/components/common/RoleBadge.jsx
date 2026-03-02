const roleConfig = {
  admin: {
    label: 'Admin',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  },
  owner: {
    label: 'Owner',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  },
  member: {
    label: 'Member',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
};

function RoleBadge({ role }) {
  const normalizedRole = String(role || '').toLowerCase();
  const config = roleConfig[normalizedRole];

  if (!config) {
    return null;
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export default RoleBadge;
