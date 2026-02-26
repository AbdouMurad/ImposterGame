import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useWS } from "../../contexts/WebSocketContext";

export default function Lobby() {
  const { send, connected, lastMessage } = useWS();

  const location = useLocation();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  // gameStarted state not needed in the lobby component (server drives navigation)
  const [myName, setMyName] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const startedNavigatedRef = useRef(false);

  // if a roomid was provided in the URL (e.g. after creating a room), pick it up
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const rid = params.get("roomid");
      const pname = params.get("player") ?? params.get("name") ?? null;
      if (rid) setRoomId(rid);
      if (pname) setMyName(pname);
    } catch {
      // ignore
    }
  }, [location.search]);

  // one-shot sync: request the current player list when we have a roomId and the socket is connected
  // useEffect(() => {
  //   if (!roomId || !connected) return;
  //   send({ type: "request-list", roomid: roomId });
  // }, [roomId, connected, send]);

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
        // navigate to the Game page when the server confirms the game started
        const rid = lastMessage.roomid ?? lastMessage.roomId ?? roomId;
        if (!startedNavigatedRef.current) {
          startedNavigatedRef.current = true;
          setStarting(false);
          const playerParam = myName ? `&player=${encodeURIComponent(myName)}` : "";
          const target = `/Game?roomid=${encodeURIComponent(rid || "")}${playerParam}`;
          navigate(target);
        }
      }
    }
  }, [lastMessage, navigate, roomId, myName]);

  function onStartGame() {
    if (!roomId) return;
    setStarting(true);
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
      {/* left: controls (70%) */}
      <div className="IdStartButtonContainer" style={{ flex: "0 0 70%", padding: 32, boxSizing: 'border-box' }}>
        <div style={{ width: "100%", maxWidth: 900 }}>
          <h1 style={{ color: "#fff", fontSize: 28, marginBottom: 12 }}>Start</h1>


          {roomId && (
            <div style={{ marginTop: 20 }}>
              <strong style={{ color: "#d1d5db" }}>Room ID:</strong>
              <div style={{ marginTop: 8, padding: 12, background: "#0b1220", color: "#fff", display: "inline-flex", gap: 8, alignItems: "center", borderRadius: 6 }}>
                <span style={{ fontFamily: "monospace", fontSize: 18 }}>{roomId}</span>
                <button onClick={copyRoomCode} style={{ cursor: 'pointer', padding: "6px 10px", borderRadius: 6, background: "#374151", color: "#fff", border: "none" }}>Copy</button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <button
              onClick={onStartGame}
              disabled={!roomId || starting}
              style={{ cursor: 'pointer', padding: "0.75rem 1rem", borderRadius: 8, background: "#ef4444", color: "#fff", border: "none" }}
            >
              {starting ? "Starting..." : "Start Game"}
            </button>
          </div>
        </div>
      </div>

      {/* right: lobby / players (30%) */}
      <div className="LobbyContainer" style={{ flex: "0 0 30%", padding: 24, backgroundColor: "#0f1724", boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 320, margin: '0 auto' }}>
          <h2 style={{ color: "#fff", fontSize: 20, marginBottom: 8 }}>Lobby</h2>
          <p style={{ color: "#9ca3af", marginBottom: 12 }}>Share the room code with friends so they can join the game.</p>

          <div style={{ marginTop: 12 }}>
            <h3 style={{ color: "#fff", marginBottom: 8 }}>Players</h3>
            <div style={{ background: "#0b1220", padding: 12, borderRadius: 8, minHeight: 120, color: "#fff" }}>
              {players.length === 0 ? (
                <div style={{ color: "#9ca3af" }}>No players yet</div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {players.map((p) => (
                    <li
                      key={p}
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                        color: p === myName ? "#a78bfa" : "#fff",
                        fontWeight: p === myName ? 700 : 400,
                      }}
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}