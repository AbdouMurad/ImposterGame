import Editor from "@monaco-editor/react";
import SideBar from "../components/SideBar.tsx";
import Problem from "../components/ProblemPanel.tsx";

import { useState } from "react";

export default function Game() {
    // TODO: Add users here
    const [usernames, setUsernames] = useState<string[]>(["James", "Abdou", "Kevin", "Paolo", "Lem"]);
    // TODO: Add call to socket for highlighted user here
    const [highlightedUser, setHighlightedUser] = useState<string>("Abdou");
    return (
        <>
            <div className="h-screen bg-gray-950">
                <div className="flex">
                    <h1 className="text-purple-700 text-xl font-bold m-5">
                        Cheet
                        <strong className="text-white">Code</strong>
                    </h1>
                </div>
                <div className="flex flex-1">
                    <SideBar Users={usernames} HighlightedUser={highlightedUser} />
                    <Problem />
                    <Editor
                        height="700px"
                        width="50%"
                        defaultLanguage="python"
                        defaultValue="// Start coding..."
                        theme="vs-dark"
                        className="w-[50%] bg-black border-2 border-gray-700 m-3"
                    />
                </div>
            </div >
        </>
    );
}