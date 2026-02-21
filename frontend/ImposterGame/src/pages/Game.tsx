import Editor from "@monaco-editor/react";
import SideBar from "../components/SideBar.tsx";
import Problem from "../components/ProblemPanel.tsx";

import { useState } from "react";

export default function Game() {
    // TODO: Add users here
    const [usernames] = useState<string[]>(["James", "Abdou", "Kevin", "Paolo", "Lem"]);
    // TODO: Add call to socket for highlighted user here
    const [highlightedUser] = useState<string>("Abdou");
    // Editor state and change handler removed for now (placeholder content used)

    const runCode = () => {
        // Add logic to execute the code here
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
                    <SideBar Users={usernames} HighlightedUser={highlightedUser} />
                    <Problem />
                    <div className="w-[50%] bg-black border-2 border-gray-700 m-3">
                        <Editor
                            height="600px"
                            width="100%"
                            defaultLanguage="python"
                            defaultValue="// Start coding..."
                            theme="vs-dark"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={runCode}
                                className="cursor-pointer w-20 m-2 p-3 rounded-xl font-bold text-sm text-gray-200 bg-purple-800 hover:bg-purple-900 transition-colors duration-300"
                            >
                                Run
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}