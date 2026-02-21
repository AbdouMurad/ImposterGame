import { Github } from "lucide-react";
import { CircleQuestionMark } from "lucide-react";
import { Link } from 'react-router-dom';

import { useState } from "react";

import Info from "../components/Info.tsx";
import JoinForm from "../components/JoinForm.tsx";
import CreateForm from "../components/CreateForm.tsx"

export default function Welcome() {
    const [isJoinOpen, setIsJoinOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <>
            <div className="h-screen bg-gray-950">
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => setIsInfoOpen(true)}
                        className="m-5 p-2 rounded-xl text-gray-200 bg-purple-950 hover:bg-purple-900 transition-colors duration-300 cursor-pointer">
                        <CircleQuestionMark size={24} />
                    </button>
                    <a
                        href="https://github.com/AbdouMurad/ImposterGame"
                        className="m-5 p-2 rounded-xl text-gray-200 bg-purple-950 hover:bg-purple-900 transition-colors duration-300"
                    >
                        <Github size={24} />
                    </a>
                </div>
                <header className="flex text-gray-200 text-4xl font-extrabold justify-center mt-60">
                    <h1 className="text-purple-700">
                        Cheet
                        <strong className="text-white">Code</strong>
                    </h1>
                </header>

                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={() => setIsJoinOpen(true)}
                        className="cursor-pointer w-30 m-2 p-3 mt-10 rounded-xl font-bold text-sm text-gray-200 bg-purple-800 hover:bg-purple-700 transition-colors duration-300">
                        Join Room
                    </button>
                    <Link to="/GameRoom/lobby">
                        <button
                            type="button"
                            className="cursor-pointer w-30 m-2 p-3 mt-10 rounded-xl font-bold text-sm text-gray-200 bg-purple-800 hover:bg-purple-700 transition-colors duration-300">
                            Create Room
                        </button>
                    </Link>

                </div>
            </div>
            {isJoinOpen && <JoinForm onCancelJoinClick={() => setIsJoinOpen(false)} />}
            {isInfoOpen && <Info onInfoExitClick={() => setIsInfoOpen(false)} />}
            {isCreateOpen && <CreateForm onCancelCreateClick={() => setIsCreateOpen(false)} />}
        </>
    );
}