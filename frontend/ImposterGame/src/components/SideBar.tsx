import UserCard from "./UserCard.tsx";

type SideBarProps = {
    Users: string[];
    HighlightedUser: string;
    Time: number;
}

export default function SideBar({ Users, HighlightedUser, Time }: SideBarProps) {
    return (
        <>
            <div className="w-[15%] bg-gray-900 my-3 mr-10 border-y-2 border-r-2 border-gray-700 rounded-r-xl">
                <div className="text-gray-400 m-5 text-sm mb-10 ">
                    Time until next round:
                    <br />
                    <strong className="font-bold text-white">
                        {Math.floor(Time / 60)}:{String(Time % 60).padStart(2, '0')}
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