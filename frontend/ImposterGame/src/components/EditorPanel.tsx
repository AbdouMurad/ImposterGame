import { GitCommitHorizontal } from "lucide-react";

import Editor from "@monaco-editor/react";

import { useRoom } from "../contexts/RoomContext.tsx";
import { useGame } from "../contexts/GameContext.tsx";

export default function VersionPanel() {
    const {
        username
    } = useRoom();

    const {
        currentPlayer,
        code
    } = useGame();

    const handleEditorChange = (code: string | undefined) => {

    };

    const runCode = () => {

    };

    return (
        <>
            <div className="w-[50%] rounded-xl bg-gray-950 border-2 border-gray-700 m-3">
                <div className="border-b-2 border-gray-700 h-5">
                </div>
                {currentPlayer === username ?
                    (<div>
                        <Editor
                            height="600px"
                            width="100%"
                            defaultLanguage="python"
                            defaultValue="// Start coding..."
                            theme="vs-dark"
                            value={code}
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
                    </div>) :
                    (<div>
                        <div className="flex text-center items-center h-[600px] text-gray-500 text-lg bg-gray-900">
                            <div className="m-50">
                                It’s {currentPlayer}’s turn.
                                Sit tight and see what they write...
                            </div>
                        </div>
                        <div className="flex justify-end border-t-2 border-gray-700 h-15">
                        </div>
                    </div>)
                }
            </div>
        </>
    );
}