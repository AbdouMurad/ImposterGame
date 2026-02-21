import { User } from "lucide-react";

type VoteUserCardProps = {
    Username: string;
    Highlight: boolean
    HandleCardClick: (username: string) => void;
}

export default function UserCard({ Username, Highlight, HandleCardClick }: VoteUserCardProps) {
    return (
        <>
            <div
                onClick={() => HandleCardClick(Username)}
                className={`flex cursor-pointer text-white mr-5 mt-3 p-3 rounded-r-xl ${Highlight ? "bg-purple-700" : "bg-gray-800"}`}>
                <User className="mr-3" />
                {Username}
            </div>
        </>
    );
}