import { useEffect, useRef, useState } from "react";
import useWebSocket from "../../hooks/useWebSocket";

export default function Lobby() {
  const wsUrl = "ws://localhost:8765"; // your backend server (use wss:// in production)
  const { send, connected, lastMessage } = useWebSocket(wsUrl, { heartbeatIntervalMs: 15000 });

  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerId] = useState(() => "p-" + Math.random().toString(36).slice(2, 9));
  const [name, setName] = useState("Player" + Math.floor(Math.random() * 1000));
  const [players, setPlayers] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const pollingRef = useRef<number | null>(null);

  // handle incoming messages from the server
  useEffect(() => {
    if (!lastMessage) return;

    // Log every message received from the backend for debugging
    try {
      console.log("[Lobby] Received WS message:", lastMessage);
    } catch (e) {
      console.log("[Lobby] Received WS message (unserializable):", lastMessage);
    }

    if (typeof lastMessage === "object") {
      const t = lastMessage.type;
      if (t === "room-created") {
        const rid = lastMessage.roomid ?? lastMessage.roomId ?? null;
        if (rid) setRoomId(rid);
      } else if (t === "player-list") {
        const list = Array.isArray(lastMessage.players) ? lastMessage.players : [];
        setPlayers(list);
      } else if (t === "player-joined") {
        // if server broadcasts player-joined (not guaranteed), update list optimistically
        const pname = lastMessage.name ?? lastMessage.playerName ?? null;
        if (pname) setPlayers((p) => (p.includes(pname) ? p : [...p, pname]));
      } else if (t === "game-started") {
        setGameStarted(true);
      }
    }
  }, [lastMessage]);

  // start polling player list once we have a room ID
  useEffect(() => {
    if (!roomId) return;

    // request player-list immediately and then poll every 2s
    const ask = () => {
      if (connected && roomId) send({ type: "player-list", roomid: roomId });
    };

    ask();
    pollingRef.current = window.setInterval(ask, 2000);

    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [roomId, connected, send]);

  function onCreateRoom() {
    // server expects: {"type":"create-room","playerid":..., "name":...}
    send({ type: "create-room", playerid: playerId, name });
  }

  function onStartGame() {
    if (!roomId) return;
    send({ type: "start-game", roomid: roomId });
  }

  async function copyRoomCode() {
    if (!roomId) return;
    try {
      await navigator.clipboard.writeText(roomId);
    } catch {
      // ignore clipboard errors
    }
  }

  return (
    <div
      id="main-container"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-between",
        width: "100%",
        height: "100vh",
        backgroundColor: "#111827",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* left panel: create room and controls */}
      <div className="IdStartButtonContainer" style={{ flex: "0 0 70%", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 900 }}>
          <h1 style={{ color: "#fff", fontSize: 28, marginBottom: 12 }}>Start / Room ID</h1>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{ padding: 8, borderRadius: 6, border: "1px solid #333", background: "#0b1220", color: "#fff" }}
            />

            <button
              onClick={onCreateRoom}
              disabled={!connected || !!roomId}
              style={{ padding: "0.75rem 1rem", borderRadius: 8, background: "#7c3aed", color: "#fff", border: "none" }}
            >
              Create Room
            </button>

            <div style={{ color: "#d1d5db", alignSelf: "center" }}>{connected ? "Connected" : "Disconnected"}</div>
          </div>

          {roomId && (
            <div style={{ marginTop: 12 }}>
              <strong style={{ color: "#d1d5db" }}>Room ID:</strong>
              <div style={{ marginTop: 6, padding: 12, background: "#0b1220", color: "#fff", display: "inline-flex", gap: 8, alignItems: "center", borderRadius: 6 }}>
                <span style={{ fontFamily: "monospace", fontSize: 18 }}>{roomId}</span>
                <button onClick={copyRoomCode} style={{ padding: "6px 10px", borderRadius: 6, background: "#374151", color: "#fff", border: "none" }}>Copy</button>
              </div>
            </div>
          )}

          {/* Player list */}
          <div style={{ marginTop: 20 }}>
            <h3 style={{ color: "#fff", marginBottom: 8 }}>Players</h3>
            <div style={{ background: "#0b1220", padding: 12, borderRadius: 8, minHeight: 80, color: "#fff" }}>
              {players.length === 0 ? (
                <div style={{ color: "#9ca3af" }}>No players yet</div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {players.map((p) => (
                    <li key={p} style={{ padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Start game button */}
          <div style={{ marginTop: 16 }}>
            <button onClick={onStartGame} disabled={!roomId || gameStarted} style={{ padding: "0.75rem 1rem", borderRadius: 8, background: "#ef4444", color: "#fff", border: "none" }}>
              {gameStarted ? "Game started" : "Start Game"}
            </button>
          </div>
        </div>
      </div>

      {/* right panel: informational */}
      <div className="LobbyContainer" style={{ flex: "0 0 30%", padding: 24, backgroundColor: "#1f2937" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: 20, marginBottom: 8 }}>Lobby</h2>
          <p style={{ color: "#d1d5db" }}>Share the room code with friends so they can join the game.</p>
          {roomId && <p style={{ color: "#d1d5db", marginTop: 12 }}>Players are listed on the left and refresh automatically.</p>}
        </div>
      </div>
    </div>
  );
}