import Editor from "@monaco-editor/react";
import SideBar from "../components/SideBar.tsx";
import VoteSideBar from "../components/VoteSideBar.tsx";
import ProblemPanel from "../components/ProblemPanel.tsx";
import ImposterPanel from "../components/ImposterPanel.tsx";
import VersionPanel from "../components/VersionPanel.tsx";

import { useState } from "react";

export default function Game() {
    type Phase = "coding" | "voting"
    // TODO: Add call to game phase here
    const [phase, setPhase] = useState<Phase>("voting");
    // TODO: Add call to users here
    const [usernames, setUsernames] = useState<string[]>(["James", "Abdou", "Kevin", "Paolo", "Lem"]);
    // TODO: Integrate with join and create forms
    const [currentUser, setcurrentUser] = useState<string>("James");
    // TODO: Add call to imposter here
    const [imposterId, setImposterId] = useState<string>("James");
    // TODO: Add call to current user here
    const [highlightedUser, setHighlightedUser] = useState<string>("Abdou");
    const [highlightedCommit, setHighlightedCommit] = useState<number>(-1);
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

    const handleCommitClick = (index: number) => {
        setHighlightedCommit(index)
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
                    {currentUser !== imposterId ? <ProblemPanel /> : <ImposterPanel />}
                    {phase === "coding" && (<div className="w-[50%] rounded-xl bg-gray-950 border-2 border-gray-700 m-3">
                        <div className="border-b-2 border-gray-700 h-5">
                        </div>
                        <Editor
                            height="600px"
                            width="100%"
                            defaultLanguage="python"
                            defaultValue="// Start coding..."
                            theme="vs-dark"
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
                    {phase === "voting" && (<VersionPanel HighlightedCommit={highlightedCommit} HandleCommitClick={handleCommitClick} />)}
                </div>
            </div >
        </>
    );
}