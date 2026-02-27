import UserCard from "./UserCard.tsx";

import { useGame } from "../contexts/GameContext.tsx";

export default function SideBar() {
    const {
        players,
        currentPlayer,
        time
    } = useGame();

    return (
        <>
            <div className="w-[15%] bg-gray-900 my-3 mr-10 border-y-2 border-r-2 border-gray-700 rounded-r-xl">
                <div className="text-gray-400 m-5 text-sm mb-10 ">
                    Time until next round:
                    <br />
                    <strong className="font-bold text-white">
                        {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
                    </strong>
                </div>
                {players.map((player) => (
                    <div key={player}>
                        <UserCard username={player} highlight={player === currentPlayer} />
                    </div>
                ))}
            </div>
        </>
    );
}