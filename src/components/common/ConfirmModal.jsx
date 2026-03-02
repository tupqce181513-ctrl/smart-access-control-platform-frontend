import { useEffect } from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const variantConfig = {
  danger: {
    icon: AlertTriangle,
    iconClass: 'text-red-500 dark:text-red-400',
    confirmClass: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
  },
  warning: {
    icon: AlertCircle,
    iconClass: 'text-amber-500 dark:text-amber-400',
    confirmClass: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-500 dark:text-blue-400',
    confirmClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-500',
  },
};

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  const selectedVariant = variantConfig[variant] || variantConfig.danger;
  const Icon = selectedVariant.icon;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isLoading, isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => {
        if (!isLoading) {
          onCancel();
        }
      }}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${selectedVariant.iconClass}`} />
            <h2
              id="confirm-modal-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex min-w-24 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-800 ${selectedVariant.confirmClass}`}
          >
            {isLoading ? <LoadingSpinner size="sm" className="border-white border-t-white/30" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
