import { useState } from 'react';
import { Send } from 'lucide-react';

function ChatInput({ onSendMessage, isDisabled = false }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isDisabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white px-3 py-2 sm:p-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Viết tin nhắn..."
          disabled={isDisabled}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-2 sm:px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 placeholder:text-gray-400 focus:ring-2 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:disabled:bg-gray-800"
        />
        <button
          type="submit"
          disabled={isDisabled || !input.trim()}
          className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
}

export default ChatInput;
