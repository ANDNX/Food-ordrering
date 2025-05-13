import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { P2PService, PeerData } from '../services/P2PService';

interface P2PContextType {
  p2pService: P2PService;
  connectedPeers: string[];
  connectToPeer: (targetId: string) => Promise<void>;
  sendData: (data: Omit<PeerData, 'timestamp'>) => void;
}

const P2PContext = createContext<P2PContextType | null>(null);

export const useP2P = () => {
  const context = useContext(P2PContext);
  if (!context) {
    throw new Error('useP2P must be used within a P2PProvider');
  }
  return context;
};

interface P2PProviderProps {
  children: React.ReactNode;
  socket: Socket;
}

export const P2PProvider: React.FC<P2PProviderProps> = ({ children, socket }) => {
  const [p2pService] = useState(() => new P2PService(socket));
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);

  useEffect(() => {
    // Update connected peers list periodically
    const interval = setInterval(() => {
      setConnectedPeers(p2pService.getConnectedPeers());
    }, 5000);

    // Set up data callback
    p2pService.setOnDataCallback((data) => {
      console.log('Received P2P data:', data);
      // Handle different types of P2P data
      switch (data.type) {
        case 'restaurant-update':
          // Handle restaurant updates
          break;
        case 'order-update':
          // Handle order updates
          break;
        case 'user-location':
          // Handle user location updates
          break;
      }
    });

    return () => {
      clearInterval(interval);
    };
  }, [p2pService]);

  const connectToPeer = async (targetId: string) => {
    try {
      await p2pService.connectToPeer(targetId);
      setConnectedPeers(p2pService.getConnectedPeers());
    } catch (error) {
      console.error('Failed to connect to peer:', error);
    }
  };

  const sendData = (data: Omit<PeerData, 'timestamp'>) => {
    p2pService.sendData(data);
  };

  return (
    <P2PContext.Provider value={{ p2pService, connectedPeers, connectToPeer, sendData }}>
      {children}
    </P2PContext.Provider>
  );
}; 