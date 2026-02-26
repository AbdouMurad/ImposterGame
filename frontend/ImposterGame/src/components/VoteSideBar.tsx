import VoteUserCard from "./VoteUserCard.tsx";

import { useGame } from "../contexts/GameContext.tsx";

type VoteBarProps = {
    HighlightedUser: string;
    HandleCardClick: (username: string) => void;
}

export default function VoteBar({ HighlightedUser, HandleCardClick }: VoteBarProps) {
    const {
        time,
        players
    } = useGame();

    const castVote = () => {
        // Add logic to cast vote here
    };

    return (
        <>
            <div className="flex flex-col justify-between w-[15%] bg-gray-900 my-3 mr-10 border-y-2 border-r-2 border-gray-700 rounded-r-xl">
                <div>
                    <div className="text-gray-400 m-5 text-sm mb-10 ">
                        Time until voting ends:
                        <br />
                        <strong className="font-bold text-white">
                            {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
                        </strong>
                    </div>
                    {players.map((player) => (
                        <div key={player}>
                            <VoteUserCard Username={player} Highlight={player === HighlightedUser} HandleCardClick={HandleCardClick} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={castVote}
                        className="cursor-pointer w-20 m-2 mt-60 p-3 rounded-xl font-bold text-sm text-gray-200 bg-purple-800 hover:bg-purple-700 transition-colors duration-300"
                    >
                        Vote
                    </button>
                </div>
            </div>
        </>
    );
}