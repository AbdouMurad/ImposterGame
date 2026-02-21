import VoteUserCard from "./VoteUserCard.tsx";

import { useState } from "react";

type VoteBarProps = {
    Users: string[];
    HighlightedUser: string;
    HandleCardClick: (username: string) => void;
}

export default function VoteBar({ Users, HighlightedUser, HandleCardClick }: VoteBarProps) {
    // TODO: Add call to socket for time here
    const [time, setTime] = useState<Number>(300);

    const castVote = () => {
        // Add logic to cast vote here
    };

    return (
        <>
            <div className="w-[15%] bg-gray-900 my-3 mr-10 border-y-2 border-r-2 border-gray-700 rounded-r-xl">
                <div className="text-gray-400 m-5 text-sm mb-10 ">
                    Time until voting ends:
                    <br />
                    <strong className="font-bold text-white">
                        {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
                    </strong>
                </div>
                {Users.map((user) => (
                    <div key={user}>
                        <VoteUserCard Username={user} Highlight={user === HighlightedUser} HandleCardClick={HandleCardClick} />
                    </div>
                ))}
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