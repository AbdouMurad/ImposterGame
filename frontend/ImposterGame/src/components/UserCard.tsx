import { User } from "lucide-react";

type UserCardProps = {
    Username: string;
    Highlight: boolean
}

export default function UserCard({ Username, Highlight }: UserCardProps) {
    return (
        <>
            <div
                className={`flex text-white mr-5 mt-3 p-3 rounded-r-xl ${Highlight ? "bg-purple-500" : "bg-gray-900"
                    }`}
            >
                <User />
                {Username}
            </div>
        </>
    );
}