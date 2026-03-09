import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, accessToken } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only connect if user is logged in
    if (!user || !accessToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect to WebSocket server using the same URL as API backend
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    // Create new socket instance
    const newSocket = io(socketUrl, {
      auth: { token: accessToken },
      // Auto-reconnection settings
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 'Infinity',
    });

    // Logging connection statuses
    newSocket.on('connect', () => {
      console.log('✓ Connected to real-time events via WebSocket');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('✗ Disconnected from WebSocket:', reason);
    });

    newSocket.on('connect_error', (error) => {
      console.error('✗ WebSocket connection error:', error.message);
    });

    setSocket(newSocket);

    // Cleanup when component unmounts or token changes
    return () => {
      newSocket.disconnect();
    };
  }, [user, accessToken]); // Re-run effect when `user` or `accessToken` changes

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
