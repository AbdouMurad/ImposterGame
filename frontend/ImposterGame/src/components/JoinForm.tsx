import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWS } from "../contexts/WebSocketContext";

type JoinFormProps = {
  onCancelJoinClick: () => void;
};

export default function JoinForm({ onCancelJoinClick }: JoinFormProps) {
  const { send, connected, lastMessage, error } = useWS();

  const [username, setUsername] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const navigate = useNavigate();

  // fallback timer refs to avoid getting stuck if server ack is missed
  const fallbackRef = useRef<number | null>(null);
  const navigatedRef = useRef(false);
  // persist the player id chosen on join so effects can reference it
  const playerIdRef = useRef<string | null>(null);

  // react to server replies (robust: handles string messages and logs them)
  useEffect(() => {
    if (!lastMessage) return;

    console.log("[JoinForm] lastMessage:", lastMessage);

    let msg: any = lastMessage;
    if (typeof msg === "string") {
      try { msg = JSON.parse(msg); } catch { /* keep as string */ }
    }

    const type = msg?.type;
    const rid = msg?.roomid ?? msg?.roomId ?? null;

    if (rid || type === "player-joined" || type === "room-created" || type === "player-list") {
      setLoading(false);
      setJoinError(null);
      if (fallbackRef.current) {
        window.clearTimeout(fallbackRef.current);
        fallbackRef.current = null;
      }
      if (!navigatedRef.current) {
        navigatedRef.current = true;
        const pname = playerIdRef.current ?? username ?? "player";
        const targetRid = rid ?? joinCode;
        if (targetRid) {
          navigate(`/GameRoom/lobby?roomid=${encodeURIComponent(targetRid)}&player=${encodeURIComponent(pname)}`);
        } else {
          navigate(`/GameRoom/lobby?player=${encodeURIComponent(pname)}`);
        }
      }
      return;
    }

    if (type === "error" || type === "join-error") {
      setLoading(false);
      setJoinError(String(msg.message ?? msg.error ?? "Failed to join"));
      if (fallbackRef.current) {
        window.clearTimeout(fallbackRef.current);
        fallbackRef.current = null;
      }
    }
  }, [lastMessage, joinCode, navigate, username]);

  // effect: surface WebSocket-level errors
  useEffect(() => {
    if (error) setJoinError(error);
  }, [error]);

  // cleanup fallback timer on unmount
  useEffect(() => {
    return () => {
      if (fallbackRef.current) {
        window.clearTimeout(fallbackRef.current);
        fallbackRef.current = null;
      }
    };
  }, []);

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

    const playerid = username.trim() ? username.trim() : "p-" + Math.random().toString(36).slice(2, 9);
    playerIdRef.current = playerid;

    // send join request to server
    send({ type: "join-room", playerid, name: username || playerid, roomid: joinCode });

    // fallback: if we don't see a server ack within 2s, navigate anyway to the lobby.
    if (fallbackRef.current) {
      window.clearTimeout(fallbackRef.current);
      fallbackRef.current = null;
    }
    navigatedRef.current = false;
    fallbackRef.current = window.setTimeout(() => {
      fallbackRef.current = null;
      if (!navigatedRef.current) {
        navigatedRef.current = true;
        setLoading(false);
        const pname = playerIdRef.current ?? username ?? "player";
        navigate(`/GameRoom/lobby?roomid=${encodeURIComponent(joinCode)}&player=${encodeURIComponent(pname)}`);
      }
    }, 2000) as unknown as number;
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