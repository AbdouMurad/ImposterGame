import Editor from "@monaco-editor/react";

import SideBar from "../components/SideBar.tsx";
import VoteSideBar from "../components/VoteSideBar.tsx";
import ProblemPanel from "../components/ProblemPanel.tsx";
import ImposterPanel from "../components/ImposterPanel.tsx";
import EditorPanel from "../components/EditorPanel.tsx";
import CommitPanel from "../components/CommitPanel.tsx";

import { useState } from "react";

import { useRoom } from "../contexts/RoomContext.tsx";
import { useGame } from "../contexts/GameContext.tsx";

export default function Game() {
    const [highlightedUser, setHighlightedUser] = useState<string>("");
    const [highlightedCommit, setHighlightedCommit] = useState<number>(-1);

    const {
        roomId,
        username,
    } = useRoom();

    const {
        gameState,
        time,
        players,
        currentPlayer,
        imposter,
        problemTitle,
        problemDescription,
        problemExamples,
        problemConstraints,
        problemCode,
        code,
        commits
    } = useGame();

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
                {gameState === "coding" &&
                    (<div className="flex flex-1">
                        <SideBar HighlightedUser={highlightedUser} />
                        {username === imposter ? <ImposterPanel /> : <ProblemPanel />}
                        <EditorPanel />
                    </div>)}
                {gameState === "voting" &&
                    (<div className="flex flex-1">
                        <VoteSideBar HighlightedUser={highlightedUser} HandleCardClick={handleCardClick} />
                        {username === imposter ? <ImposterPanel /> : <ProblemPanel />}
                        <CommitPanel HighlightedCommit={highlightedCommit} HandleCommitClick={handleCommitClick} />
                    </div>)}
                {/* {phase === "coding" ?
                        (<SideBar Users={usernames} HighlightedUser={highlightedUser} Time={time} />) :
                        (<VoteSideBar Users={usernames} HighlightedUser={highlightedUser} HandleCardClick={handleCardClick} Time={time} />)}
                    {phase !== "results" ? (
                        imposterId ? (  // only render once imposterId is set
                            currentUser !== imposterId ? <ProblemPanel Title={title} Description={description} Examples={examples} /> : <ImposterPanel />
                        ) : (
                            <div className="text-gray-400">Loading...</div> // optional placeholder
                        )
                    ) : (
                        <ResultsPanel />
                    )}
                    <ProblemPanel Title={title} Description={description} Examples={examples} />
                    {phase === "coding" && (<div className="w-[50%] rounded-xl bg-gray-950 border-2 border-gray-700 m-3">
                        <div className="border-b-2 border-gray-700 h-5">
                        </div>
                        {(currentUser === highlightedUser &&
                            <Editor
                                height="600px"
                                width="100%"
                                defaultLanguage="python"
                                defaultValue="// Start coding..."
                                theme="vs-dark"
                                value={code}
                                onChange={handleEditorChange}
                            />)}
                        <div className="flex justify-end border-t-2 border-gray-700">
                            <button
                                onClick={runCode}
                                className="cursor-pointer w-20 m-2 p-3 rounded-xl font-bold text-sm text-gray-200 bg-purple-800 hover:bg-purple-900 transition-colors duration-300"
                            >
                                Run
                            </button>
                        </div>
                    </div>)}
                    {phase === "voting" && (<VersionPanel HighlightedCommit={highlightedCommit} HandleCommitClick={handleCommitClick} Commits={commits} />)} */}
            </div >
        </>
    );
}