import { createContext, useContext, useState } from "react";

const RoomContext = createContext({
    roomId: "",
    username: "",
    players: []
});

export function RoomProvider({ children }: { children: React.ReactNode }) {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const [players, setPlayers] = useState([]);

    const value = {
        roomId,
        username,
        players,
    }

    return (
        <RoomContext.Provider value={value}>
            {children}
        </RoomContext.Provider>
    );
}

export function useRoom() {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error("useRoom must be used within a RoomProvider");
    }
    return context;
}