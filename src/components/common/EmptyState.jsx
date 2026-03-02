import { createElement } from 'react';
import { Inbox } from 'lucide-react';

function EmptyState({ icon, title, description, action }) {
  const iconComponent = icon || Inbox;

  return (
    <div className="flex min-h-55 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800">
      {createElement(iconComponent, {
        className: 'mb-4 h-12 w-12 text-gray-400 dark:text-gray-500',
      })}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">{description}</p>
      ) : null}
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;
