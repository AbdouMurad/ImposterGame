import { User } from "lucide-react";

type LobbyUserCardProps = {
    Username: string;
}

export default function LobbyUserCard({ Username }: LobbyUserCardProps) {
    return (
        <>
            <div className="flex items-center text-gray-200 mx-5 mt-3 p-3 rounded-xl bg-gray-800">
                <User className="mr-3" />
                {Username}
            </div>
        </>
    );
}