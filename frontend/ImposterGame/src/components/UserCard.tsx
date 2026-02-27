import { User } from "lucide-react";

type UserCardProps = {
    username: string;
    highlight: boolean
}

export default function UserCard({ username, highlight }: UserCardProps) {
    return (
        <>
            <div className={`flex text-white mr-5 mt-3 p-3 rounded-r-xl ${highlight ? "bg-purple-700" : "bg-gray-800"}`}>
                <User className="mr-3" />
                {username}
            </div>
        </>
    );
}