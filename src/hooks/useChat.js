import { useState, useCallback } from 'react';
import { findBotResponse } from '../utils/chatBotResponses';

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 'initial',
      type: 'bot',
      content: 'Xin chào! 👋 Tôi có thể giúp gì cho bạn?',
      timestamp: Date.now(),
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((content, type) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      type,
      content,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    // Add user message
    addMessage(userMessage, 'user');

    // Show typing indicator
    setIsTyping(true);

    // Simulate typing delay (500ms)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get bot response
    const botResponse = findBotResponse(userMessage);
    addMessage(botResponse, 'bot');

    // Hide typing indicator
    setIsTyping(false);
  }, [addMessage]);

  return {
    messages,
    isTyping,
    sendMessage,
  };
};
