import { useEffect, useRef, useState } from 'react';


type MessageHandler = (msg: any) => void;

export default function useWebSocket(url: string, onMessage?: MessageHandler) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;
    

    ws.onopen = () => setConnected(true);
    ws.onmessage = (ev) => {
      let data: any;
      try { data = JSON.parse(ev.data); } catch { data = ev.data; }
      setLastMessage(data);
      onMessage?.(data);
    };
    ws.onerror = () => setConnected(false);
    ws.onclose = () => setConnected(false);

    return () => {
      try { ws.close(); } catch {}
      wsRef.current = null;
    };
  }, [url, onMessage]);

  function send(obj: any) {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(obj));
    } else {
      throw new Error('WebSocket is not open');
    }
  }

  return { send, connected, lastMessage };
}