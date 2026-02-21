import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";

type JoinFormProps = {
  onCancelJoinClick: () => void;
};

export default function JoinForm({ onCancelJoinClick }: JoinFormProps) {
  const wsUrl = "ws://localhost:8765"; 
  const { send, connected, lastMessage, error } = useWebSocket(wsUrl, { heartbeatIntervalMs: 15000 });

  const [username, setUsername] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const navigate = useNavigate();

  // react to server replies (robust: handles string messages and logs them)
  useEffect(() => {
    if (!lastMessage) return;

    // raw log for diagnostics
    console.log("[JoinForm] lastMessage:", lastMessage);

    // try to parse string payloads
    let msg: any = lastMessage;
    if (typeof msg === "string") {
      try {
        msg = JSON.parse(msg);
      } catch {
        // leave as string
      }
    }

    const type = msg?.type;
    const rid = msg?.roomid ?? msg?.roomId ?? null;

    if (rid || type === "player-joined" || type === "room-created" || type === "player-list") {
      setLoading(false);
      setJoinError(null);
      const targetRid = rid ?? joinCode;
      if (targetRid) {
        navigate(`/GameRoom/lobby?roomid=${encodeURIComponent(targetRid)}`);
      } else {
        navigate(`/GameRoom/lobby`);
      }
      return;
    }

    if (type === "error" || type === "join-error") {
      setLoading(false);
      setJoinError(String(msg.message ?? msg.error ?? "Failed to join"));
    }
  }, [lastMessage, joinCode, navigate]);

  // effect: surface WebSocket-level errors
  useEffect(() => {
    if (error) setJoinError(error);
  }, [error]);

  function onJoinClick() {
    if (!connected) {
      setJoinError("Not connected to server");
      return;
    }
    if (!joinCode) {
      setJoinError("Please enter a room code");
      return;
    }
    setJoinError(null);
    setLoading(true);

    // choose a stable player id — here we use the username if provided, else a random id
    const playerid = username.trim() ? username.trim() : "p-" + Math.random().toString(36).slice(2, 9);

    // send join request to server
    send({ type: "join-room", playerid, name: username || playerid, roomid: joinCode });
    // wait for server reply in lastMessage effect
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
        <form className="bg-gray-900 rounded-lg border border-purple-950 w-100 h-75">
          <h1 className="text-purple-700 text-l font-bold m-5">Join Room</h1>

          <div className="flex flex-col m-5">
            <label className="text-gray-200 text-sm mb-2">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded bg-gray-900 text-white px-3 py-1"
            />
          </div>

          <div className="flex flex-col m-5">
            <label className="text-gray-200 text-sm mb-2">Join Code</label>
            <input
              type="text"
              id="joinCode"
              placeholder="Enter join code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="border rounded bg-gray-900 text-white px-3 py-1"
            />
          </div>

          {joinError && <div className="text-red-400 text-sm px-5">{joinError}</div>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancelJoinClick}
              className="cursor-pointer w-20 p-3 m-2 rounded-xl font-bold text-xs text-gray-200 bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onJoinClick}
              disabled={!connected || loading}
              className="cursor-pointer w-20 p-3 m-2 rounded-xl font-bold text-xs text-gray-200 bg-purple-950 hover:bg-purple-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Joining..." : "Join"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}