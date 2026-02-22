import Editor from "@monaco-editor/react";
import SideBar from "../components/SideBar.tsx";
import VoteSideBar from "../components/VoteSideBar.tsx";
import ProblemPanel from "../components/ProblemPanel.tsx";
import ImposterPanel from "../components/ImposterPanel.tsx";
import VersionPanel from "../components/VersionPanel.tsx";
import ResultsPanel from "../components/ResultsPanel.tsx";
import { useNavigate } from "react-router-dom";
import { useWS } from "../contexts/WebSocketContext";

import { useLocation } from "react-router-dom";

import { useState, useEffect, use } from "react";

export default function Game() {
    type Phase = "coding" | "voting" | "results"
    const { send, connected, lastMessage, error } = useWS();
    const [phase, setPhase] = useState<Phase>("coding");

    const [roundActive, setRoundActive] = useState<boolean>(true);

    const [roomId, setRoomId] = useState<string>("");
    const [usernames, setUsernames] = useState<string[]>([]);
    const [currentUser, setCurrentUser] = useState<string>("");
    // TODO: Add call to imposter here
    const [imposterId, setImposterId] = useState<string>("");
    // TODO: Add call to current user here
    const [highlightedUser, setHighlightedUser] = useState<string>("");
    const [highlightedCommit, setHighlightedCommit] = useState<number>(-1);
    const [code, setCode] = useState("// Start coding...");

    const [time, setTime] = useState<number>(1);

    //TODO : Add call to socket for problem info here
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [examples, setExamples] = useState<string[]>([]);
    // const [constraints] = useState<string[]>([]);

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get("roomid") ?? "";
    const playerName = params.get("player") ?? "";

    const [commits, setCommits] = useState<[]>([]);

    useEffect(() => {
        setRoomId(id);
        setCurrentUser(playerName);
        send({ type: "request-order", playerid: playerName, name: playerName, roomid: id });

    }, []);

    useEffect(() => {

        if (currentUser == highlightedUser) {
            console.log("starting round")
            send({ type: "start-round", roomid: id });
            //SET PHASE
        }
        startTurn();

    }, [imposterId]);

    const startTurn = () => {
        send({ type: "request-code", playerid: currentUser, name: currentUser, roomid: id });
    }

    // const timeLoop = () => {
    //     if (time > 0 && currentUser == highlightedUser) {
    //         send({ type: "request-time", roomid: id });
    //     } else {
    //         setRoundActive(false);
    //     }
    // }

    useEffect(() => {
        if (!lastMessage) return;

        let msg: any = lastMessage;
        if (typeof msg === "string") {
            try { msg = JSON.parse(msg); } catch { /* keep as string */ }
        }

        const type = msg?.type;

        console.log("Received message:", lastMessage);
        if (type === "turn-list") {
            setUsernames(msg.players);
            setHighlightedUser(msg.players[0]);
            send({ type: "request-imposter", playerid: playerName, roomid: id });

        } else if (type === "imposter-player") {
            setImposterId(msg.name);
        } else if (type === "source-code") {
            setCode(msg.code);
            setTitle(msg.questionTitle);
            setDescription(msg.questionDescription);
            setExamples(msg.questionExamples);

        } else if (type === "time-left") {
            setTime(parseInt(msg.timeLeft));
            setHighlightedUser(msg.currentPlayer);

        } else if (type === "next-turn") {
            if (currentUser === highlightedUser) {
                send({ type: "log-code", name: playerName, playerid: playerName, roomid: id, code: code });
            }
            setHighlightedUser(msg.name);

            startTurn();

        } else if (type === "test-results") {
            if (msg.complete === "passed") {
                setPhase("voting");
                send({ type: "log-code", name: playerName, playerid: playerName, roomid: id, code: code });
                send({ type: "request-logs", playerid: playerName, roomid: id });
            }
        } else if (type === "log-list") {
            setCommits(msg.logs);
            console.log("Received commits:", msg.logs);
        }
    }, [lastMessage, navigate]);

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || "");
    };

    const runCode = () => {
        send({ type: "run-code", roomid: id, playerid: playerName, sourcecode: code });
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
                    {phase === "coding" ?
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
                    {/* <ProblemPanel Title={title} Description={description} Examples={examples} /> */}
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
                    {phase === "voting" && (<VersionPanel HighlightedCommit={highlightedCommit} HandleCommitClick={handleCommitClick} Commits={commits} />)}
                </div>
            </div >
        </>
    );
}