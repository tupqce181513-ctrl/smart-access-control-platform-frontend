const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

function LoadingSpinner({ size = 'md', className = '', fullPage = false }) {
  const spinner = (
    <div
      className={`animate-spin rounded-full border-solid border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-500 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;
