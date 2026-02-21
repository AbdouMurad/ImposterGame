import { useEffect, useRef, useState } from "react";

type MessageHandler = (msg: any) => void;

type UseWebSocketOptions = {
  onMessage?: MessageHandler;
  reconnect?: boolean;            // auto reconnect on close
  maxRetries?: number;            // max reconnect attempts
  heartbeatIntervalMs?: number;   // how often to send "ping"
};

export default function useWebSocket(
  url: string,
  options: UseWebSocketOptions = {}
) {
  const { onMessage, reconnect = true, maxRetries = 10, heartbeatIntervalMs = 20000 } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const messageQueueRef = useRef<any[]>([]);
  const forcedCloseRef = useRef(false);

  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // connect function: establishes a WebSocket and sets handlers
  function connect() {
    forcedCloseRef.current = false;
    setError(null);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        retriesRef.current = 0;
        setConnected(true);
        // flush queued messages
        while (messageQueueRef.current.length && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const obj = messageQueueRef.current.shift();
          wsRef.current.send(JSON.stringify(obj));
        }
        // start heartbeat
        startHeartbeat();
      };

      ws.onmessage = (ev) => {
        let data: any;
        try { data = JSON.parse(ev.data); } catch { data = ev.data; }
        // handle basic pong (server reply) so heartbeat can be simple if you choose to use it
        if (data && data.type === "pong") {
          // optional: ignore or track last pong time
        } else {
          setLastMessage(data);
          onMessage?.(data);
        }
      };

      ws.onerror = (ev) => {
        setError("WebSocket error");
      };

      ws.onclose = () => {
        setConnected(false);
        stopHeartbeat();
        wsRef.current = null;
        if (!forcedCloseRef.current && reconnect) {
          scheduleReconnect();
        }
      };
    } catch (e: any) {
      setError(String(e));
      scheduleReconnect();
    }
  }

  function scheduleReconnect() {
    if (!reconnect) return;
    if (retriesRef.current >= maxRetries) {
      setError("Max reconnect attempts reached");
      return;
    }
    retriesRef.current += 1;
    // exponential backoff with jitter
    const base = 1000;
    const max = 30000;
    let delay = Math.min(max, base * Math.pow(2, retriesRef.current));
    const jitter = Math.random() * 0.3 * delay;
    delay = Math.floor(delay + jitter);

    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    reconnectTimeoutRef.current = window.setTimeout(() => {
      connect();
    }, delay);
  }

  function startHeartbeat() {
    stopHeartbeat();
    if (!heartbeatIntervalMs || heartbeatIntervalMs <= 0) return;
    heartbeatIntervalRef.current = window.setInterval(() => {
      try {
        send({ type: "ping" });
      } catch {
        // ignore, send() already queues if not ready
      }
    }, heartbeatIntervalMs);
  }

  function stopHeartbeat() {
    if (heartbeatIntervalRef.current) {
      window.clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }

  // Send JSON object. If not connected, queue until connection is open.
  function send(obj: any) {
    const ws = wsRef.current;
    const payload = typeof obj === "string" ? obj : JSON.stringify(obj);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    } else {
      // Queue until we reconnect
      try {
        const parsed = typeof obj === "string" ? obj : JSON.parse(JSON.stringify(obj));
        messageQueueRef.current.push(parsed);
      } catch {
        // If object isn't serializable, throw
        throw new Error("Message not serializable");
      }
    }
  }

  // Close and prevent reconnection
  function close() {
    forcedCloseRef.current = true;
    stopHeartbeat();
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }
    setConnected(false);
  }

  useEffect(() => {
    // start connection
    connect();

    return () => {
      // cleanup on unmount
      close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]); // reconnects if url changes

  return { send, connected, lastMessage, error, close };
}