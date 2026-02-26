import { useState } from "react";

type JoinFormProps = {
  onCancelJoinClick: () => void;
};

export default function JoinForm({ onCancelJoinClick }: JoinFormProps) {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");

  function onJoinClick() {

  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
        <form className="bg-gray-900 rounded-lg border border-gray-700 w-100 h-75">
          <h1 className="text-white text-l font-bold m-5">Join Room</h1>

          <div className="flex flex-col m-5">
            <label className="text-gray-200 text-sm mb-2">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-700 rounded bg-gray-900 text-white px-3 py-1"
            />
          </div>

          <div className="flex flex-col m-5">
            <label className="text-gray-200 text-sm mb-2">Room Code</label>
            <input
              type="text"
              id="roomCode"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="border border-gray-700 rounded bg-gray-900 text-white px-3 py-1"
            />
          </div>

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
              className="cursor-pointer w-20 p-3 m-2 rounded-xl font-bold text-xs text-gray-200 bg-purple-700 hover:bg-purple-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </>
  );
}