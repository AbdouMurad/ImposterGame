import UserCard from "./UserCard.tsx";

import { useState } from "react";

type SideBarProps = {
    Users: string[];
    HighlightedUser: string;
}

export default function SideBar({ Users, HighlightedUser }: SideBarProps) {
    // TODO: Add call to socket for time here
    const [time, setTime] = useState<Number>(120);
    return (
        <>
            <div className="w-[15%] bg-gray-950 my-3 mr-15 border-y-2 border-r-2 border-gray-700">
                <div className="text-gray-400 m-5 text-sm mb-10 ">
                    Time until next round:
                    <br />
                    <strong className="font-bold text-white">
                        {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
                    </strong>
                </div>
                {Users.map((user) => (
                    <div key={user}>
                        <UserCard Username={user} Highlight={user === HighlightedUser} />
                    </div>
                ))}
            </div>
        </>
    );
}