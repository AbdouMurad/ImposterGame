import React, { createContext, useContext } from 'react';
import useWebSocket from '../hooks/useWebSocket';

type WSContext = {
  send: (obj: any) => void;
  connected: boolean;
  lastMessage: any | null;
  error: string | null;
  close: () => void;
};

const ctx = createContext<WSContext | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const wsUrl = 'wss://bewhiskered-nonprofessorial-kristel.ngrok-free.dev';
  const { send, connected, lastMessage, error, close } = useWebSocket(wsUrl, { heartbeatIntervalMs: 15000 });

  return <ctx.Provider value={{ send, connected, lastMessage, error, close }}>{children}</ctx.Provider>;
}

export function useWS() {
  const c = useContext(ctx);
  if (!c) throw new Error('useWS must be used inside WebSocketProvider');
  return c;
}