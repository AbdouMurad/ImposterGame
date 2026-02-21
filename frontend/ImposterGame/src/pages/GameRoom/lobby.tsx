import { useEffect, useRef, useState } from "react";

type RoomCreatedMsg = { type: "room-created", roomid: string };

export default function Lobby() {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [name, setName] = useState<string>("");
    const ws = useRef<WebSocket | null>(null);
    
    useEffect(() => {
        // Establish WebSocket connection when component mounts
        ws.current = new WebSocket("ws://localhost:8000/ws");
        ws.current.onopen = () => {
            console.log("WebSocket connection established");
            // Send create-room message to backend
            const createRoomMsg = { type: "create-room", name: "HostPlayer" };
            ws.current?.send(JSON.stringify(createRoomMsg));
        }

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "room-created") {
                setRoomId(data.roomid);
            }
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    return (
    <div
      id="main-container"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        width: '100%',
        height: '100vh',
        backgroundColor: '#111827',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      <div
        className="IdStartButtonContainer"
        style={{
          flex: '0 0 70%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24
        }}
      >
        <div style={{ width: '100%', maxWidth: 900 }}>
          <h1 style={{ color: '#fff', fontSize: 28, marginBottom: 12 }}>Start / Room ID</h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ padding: '0.75rem 1rem', borderRadius: 8, background: '#7c3aed', color: '#fff', border: 'none' }}>
              Start
            </button>
          </div>
        </div>
      </div>

      <div
        className="LobbyContainer"
        style={{
          flex: '0 0 30%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: '1px solid rgba(255,255,255,0.04)',
          padding: 24,
          backgroundColor: '#1f2937'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 20, marginBottom: 8 }}>Lobby</h2>
          <p style={{ color: '#d1d5db' }}>Waiting for players...</p>
        </div>
      </div>
    </div>
  );
}
