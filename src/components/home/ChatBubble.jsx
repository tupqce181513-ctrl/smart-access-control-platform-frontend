import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

function ChatBubble({ message }) {
  const isBot = message.type === 'bot';

  return (
    <div className={`mb-3 flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-xs sm:max-w-sm rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base ${
          isBot
            ? 'rounded-bl-none bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
            : 'rounded-br-none bg-blue-600 text-white'
        }`}
      >
        <p className="">{message.content}</p>
        <p
          className={`mt-1 text-xs ${
            isBot ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'
          }`}
        >
          {formatDistanceToNow(new Date(message.timestamp), {
            addSuffix: true,
            locale: vi,
          })}
        </p>
      </div>
    </div>
  );
}

export default ChatBubble;
