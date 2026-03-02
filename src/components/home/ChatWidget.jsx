import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isTyping, sendMessage } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end transition-all duration-300 sm:inset-auto sm:bottom-24 sm:right-6">
          {/* Overlay for mobile */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Window - Enhanced */}
          <div className="relative z-40 w-full flex flex-col overflow-hidden rounded-t-lg border border-gray-200 bg-white shadow-2xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 sm:w-96 sm:rounded-2xl h-[calc(100vh-140px)] sm:h-130 animate-slide-up">
            {/* Header - Gradient */}
            <div className="relative flex items-center justify-between border-b border-gray-200 bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-4 shrink-0 dark:border-gray-700 dark:from-blue-500 dark:to-indigo-500">
              {/* Animated background shimmer */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmer-slow 3s infinite'
                }}
              />

              <div className="relative flex items-center gap-2">
                <div className="relative">
                  <MessageCircle size={20} className="text-white animate-bounce" style={{ animationDuration: '2s' }} />
                  <Sparkles size={12} className="absolute -top-1 -right-1 text-yellow-300 animate-spin" style={{ animationDuration: '2s' }} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Trợ Lý Dự Án</h3>
                  <p className="text-xs text-blue-100">Luôn sẵn sàng giúp đỡ</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="relative p-2 text-white transition-all duration-300 rounded-lg hover:bg-white/20 active:scale-95 hover:scale-110"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-linear-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-5 space-y-4">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}

              {isTyping && (
                <div className="mb-3 flex justify-start animate-fade-in">
                  <div className="rounded-2xl rounded-bl-none bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 px-5 py-3 shadow-md">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 animate-bounce rounded-full bg-gray-500 dark:bg-gray-400" style={{ animationDelay: '0s' }}></div>
                      <div className="h-3 w-3 animate-bounce rounded-full bg-gray-500 dark:bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-3 w-3 animate-bounce rounded-full bg-gray-500 dark:bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <ChatInput onSendMessage={sendMessage} isDisabled={isTyping} />
            </div>
          </div>
        </div>
      )}

      {/* Float Button - Enhanced */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-2xl transition-all duration-300 hover:shadow-blue-600/50 hover:scale-110 active:scale-95 dark:from-blue-500 dark:to-indigo-500 group overflow-hidden border-2 border-white/20 ${
          isOpen ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
        
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:animate-pulse"></div>

        <div className="relative flex items-center gap-2">
          <MessageCircle size={24} className="animate-bounce" style={{ animationDuration: '2s' }} />
          <Sparkles size={14} className="text-yellow-300 animate-spin absolute top-1 right-1" style={{ animationDuration: '2s' }} />
        </div>
      </button>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmerSlow {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .group-hover\\:shadow-blue-600\\/50:hover {
          box-shadow: 0 0 30px rgba(37, 99, 235, 0.5);
        }
      `}</style>
    </>
  );
}

export default ChatWidget;
