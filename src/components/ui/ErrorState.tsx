interface ErrorStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function ErrorState({ title, message, action }: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <div className="rounded-xl bg-white dark:bg-gray-800 p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        {action && (
          <a
            href={action.href}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            {action.label}
          </a>
        )}
      </div>
    </div>
  );
}
