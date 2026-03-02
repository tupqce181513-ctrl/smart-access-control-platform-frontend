const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
};

const statusConfig = {
  online: {
    label: 'Online',
    dot: 'bg-green-500',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    showDot: true,
  },
  offline: {
    label: 'Offline',
    dot: 'bg-gray-400',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    showDot: true,
  },
  locked: {
    label: 'Locked',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  },
  unlocked: {
    label: 'Unlocked',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  },
  success: {
    label: 'Success',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  },
  failed: {
    label: 'Failed',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  },
  active: {
    label: 'Active',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  },
  inactive: {
    label: 'Inactive',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  },
};

function StatusBadge({ status, size = 'sm' }) {
  const normalizedStatus = String(status || '').toLowerCase();
  const config = statusConfig[normalizedStatus];

  if (!config) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        sizeClasses[size] || sizeClasses.sm
      } ${config.badge}`}
    >
      {config.showDot ? <span className={`h-2 w-2 rounded-full ${config.dot}`} /> : null}
      {config.label}
    </span>
  );
}

export default StatusBadge;
