function buildPageList(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) {
    pages.push('...left');
  }

  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  if (end < totalPages - 1) {
    pages.push('...right');
  }

  pages.push(totalPages);
  return pages;
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const pages = buildPageList(page, totalPages);

  const baseButtonClass =
    'rounded-md border px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage || page <= 1}
          className={`${baseButtonClass} border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800`}
        >
          Prev
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {page}/{totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage || page >= totalPages}
          className={`${baseButtonClass} border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800`}
        >
          Next
        </button>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage || page <= 1}
          className={`${baseButtonClass} border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800`}
        >
          Prev
        </button>

        {pages.map((item) => {
          if (typeof item !== 'number') {
            return (
              <span key={item} className="px-1 text-gray-500 dark:text-gray-400">
                ...
              </span>
            );
          }

          const isCurrent = item === page;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`${baseButtonClass} min-w-9 ${
                isCurrent
                  ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage || page >= totalPages}
          className={`${baseButtonClass} border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800`}
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
