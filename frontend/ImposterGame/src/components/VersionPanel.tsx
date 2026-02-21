import Editor from "@monaco-editor/react";

import { GitCommitHorizontal } from "lucide-react";
import { useState } from "react";
import CommitCard from "./CommitCard";

type Commit = {
    index: number
    username: string;
    code: string
}

type VersionPanelProps = {
    HighlightedCommit: number;
    HandleCommitClick: (index: number) => void;
}

export default function VersionPanel({ HighlightedCommit, HandleCommitClick }: VersionPanelProps) {
    const [commits, setCommits] = useState<Commit[]>([{ index: 0, username: "James", code: "// Hello World" },
    { index: 1, username: "Abdou", code: "// Hello World" },
    { index: 2, username: "Kevin", code: "// Hello World" },
    { index: 3, username: "Paolo", code: "// Hello World" },
    { index: 4, username: "Lem", code: "// Hello World" }]);

    return (
        <>
            <div className="w-[50%] rounded-xl bg-gray-950 border-2 border-gray-700 m-3">
                <div className="border-b-2 border-gray-700 h-5">
                </div>
                <div className="flex">
                    <div className="bg-gray-950 w-[40%] text-gray-200 font-bold border-r-2 border-gray-700">
                        <h1 className="flex m-5">
                            <GitCommitHorizontal className="mr-2" />
                            Commits
                        </h1>
                        <div className="flex flex-col items-center ">
                            {commits.map((commit) => (
                                <div key={commit.index}>
                                    <CommitCard Index={commit.index} Username={commit.username} IsFirst={commit.index === 0} IsLast={commit.index === commits.length - 1} Highlight={commit.index === HighlightedCommit} HandleCommitClick={HandleCommitClick} />
                                </div>
                            ))}
                        </div>

                    </div>
                    <Editor
                        height="600px"
                        width="60%"
                        defaultLanguage="python"
                        defaultValue="// Code snippet"
                        theme="vs-dark"
                        options={{
                            readOnly: true
                        }}
                    />
                </div>
                <div className="flex justify-end border-t-2 border-gray-700">
                </div>
            </div>
        </>
    );
}