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
    const [commits, setCommits] = useState<Commit[]>([{ index: 0, username: "James", code: "// Hello James" },
    { index: 1, username: "Abdou", code: "// Hello Abdou" },
    { index: 2, username: "Kevin", code: "// Hello Kevin" },
    { index: 3, username: "Paolo", code: "// Hello Paolo" },
    { index: 4, username: "Lem", code: "// Hello Lem" }]);

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
                    {HighlightedCommit !== -1 ? (
                        <Editor
                            height="600px"
                            width="60%"
                            defaultLanguage="python"
                            value={commits?.[HighlightedCommit]?.code}
                            theme="vs-dark"
                            options={{
                                readOnly: true
                            }}
                        />)
                        :
                        (<div className="flex text-center items-center h-[600px] w-[60%] text-gray-500 text-lg bg-gray-900">
                            <div className="m-10">
                                The problem has been solved! Review the code snapshots carefully, select the commit files to inspect changes, then vote for the player you think was the imposter.
                                Remember — look for suspicious edits, unusual patterns, and don’t be fooled!
                            </div>
                        </div>)}
                </div>
                <div className="flex justify-end border-t-2 border-gray-700">
                </div>
            </div>
        </>
    );
}