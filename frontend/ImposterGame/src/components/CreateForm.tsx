import { useEffect, useRef, useState } from "react";
import { useWS } from "../contexts/WebSocketContext";
import { useNavigate } from "react-router-dom";

type CreateFormProps = {
  onCancelCreateClick: () => void;
};

export default function CreateForm({ onCancelCreateClick }: CreateFormProps) {
  const { send, connected, lastMessage } = useWS();
  const [roomId, setRoomId] = useState<string | null>(null);
  // removed: const [gameStarted, setGameStarted] = useState(false);

  const [name, setName] = useState("Player" + Math.floor(Math.random() * 1000));
  const pollingRef = useRef<number | null>(null);
  const [waitingForCreate, setWaitingForCreate] = useState(false);

  const navigate = useNavigate();

  // handle incoming messages from the server
  useEffect(() => {
    if (!lastMessage) return;

    try {
      console.log("[CreateForm] Received WS message:", lastMessage);
    } catch (e) {
      console.log("[CreateForm] Received WS message (unserializable):", lastMessage);
    }

    if (typeof lastMessage === "object") {
      const t = lastMessage.type;
      if (t === "room-created") {
        const rid = lastMessage.roomid ?? lastMessage.roomId ?? null;
        if (rid) {
          setRoomId(rid);
          // If we issued the create request from this component, navigate now
          if (waitingForCreate) {
            setWaitingForCreate(false);
            // include player's name so Lobby can highlight it
            navigate(
              `/GameRoom/lobby?roomid=${encodeURIComponent(rid)}&player=${encodeURIComponent(name)}`
            );
          }
        }
      }
      // removed handling for "game-started" since this component doesn't need to track it
    }
  }, [lastMessage, waitingForCreate, navigate]);

  // (existing polling effect is fine if you keep it)
  useEffect(() => {
    if (!roomId) return;
    const ask = () => {
      if (connected && roomId) send({ type: "request-list", roomid: roomId });
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
    // include both playerid and name; wait for reply before navigating
    send({ type: "create-room", playerid: name, name });
    setWaitingForCreate(true);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
        <form className="bg-gray-900 rounded-lg border border-purple-950 w-100 h-50">
          <h1 className="text-purple-700 text-l font-bold m-5">Create Room</h1>

          <div className="flex flex-col m-5">
            <label className="text-gray-200 text-sm mb-2">Username</label>
            <input
              type="text"
              id="joinCode"
              placeholder="Enter username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded bg-gray-900 text-white px-3 py-1"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancelCreateClick}
              className="cursor-pointer w-20 p-3 m-2 rounded-xl font-bold text-xs text-gray-200 bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onCreateRoom}
              disabled={!connected || waitingForCreate}
              className="cursor-pointer w-20 p-3 m-2 rounded-xl font-bold text-xs text-gray-200 bg-purple-950 hover:bg-purple-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {waitingForCreate ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}