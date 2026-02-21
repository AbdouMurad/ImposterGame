import Editor from "@monaco-editor/react";
import SideBar from "../components/SideBar.tsx";
import VoteSideBar from "../components/VoteSideBar.tsx";
import Problem from "../components/ProblemPanel.tsx";
import VersionPanel from "../components/VersionPanel.tsx";

import { useState } from "react";

export default function Game() {
    type Phase = "coding" | "voting"
    const [phase, setPhase] = useState<Phase>("voting");
    // TODO: Add users here
    const [usernames, setUsernames] = useState<string[]>(["James", "Abdou", "Kevin", "Paolo", "Lem"]);
    // TODO: Add call to socket for highlighted user here
    const [highlightedUser, setHighlightedUser] = useState<string>("Abdou");
    const [code, setCode] = useState("// Start coding...");

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || "");
    };

    const runCode = () => {
        // Add logic to execute the code here
    };

    const handleCardClick = (username: string) => {
        setHighlightedUser(username)
    };

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
                    {phase === "coding" && (<SideBar Users={usernames} HighlightedUser={highlightedUser} />)}
                    {phase === "voting" && (<VoteSideBar Users={usernames} HighlightedUser={highlightedUser} HandleCardClick={handleCardClick} />)}
                    <Problem />
                    {phase === "coding" && (<div className="w-[50%] rounded-xl bg-gray-950 border-2 border-gray-700 m-3">
                        <div className="border-b-2 border-gray-700 h-5">
                        </div>
                        <Editor
                            height="600px"
                            width="100%"
                            defaultLanguage="python"
                            defaultValue="// Start coding..."
                            theme="vs-dark"
                            onChange={handleEditorChange}
                        />
                        <div className="flex justify-end border-t-2 border-gray-700">
                            <button
                                onClick={runCode}
                                className="cursor-pointer w-20 m-2 p-3 rounded-xl font-bold text-sm text-gray-200 bg-purple-800 hover:bg-purple-900 transition-colors duration-300"
                            >
                                Run
                            </button>
                        </div>
                    </div>)}
                    {phase === "voting" && (<VersionPanel />)}
                </div>
            </div >
        </>
    );
}