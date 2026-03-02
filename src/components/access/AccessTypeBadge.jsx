const typeConfig = {
  permanent: {
    label: 'Permanent',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  scheduled: {
    label: 'Scheduled',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  one_time: {
    label: 'One-time',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  },
};

function AccessTypeBadge({ type }) {
  const normalizedType = String(type || '').toLowerCase();
  const config = typeConfig[normalizedType];

  if (!config) {
    return null;
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export default AccessTypeBadge;
