import Editor from "@monaco-editor/react";

import { GitCommitHorizontal } from "lucide-react";
import { useState } from "react";
import CommitCard from "./CommitCard";

type Commit = {
    username: string;
    code: string
}

export default function Game() {
    const [commits, setCommits] = useState<Commit[]>([{ username: "James", code: "// Hello World" }, { username: "Abdou", code: "// Hello World" }, { username: "Kevin", code: "// Hello World" }]);
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
                            {commits.map((commit, index) => {
                                const isFirst = index === 0;
                                const isLast = index === commits.length - 1;

                                return (
                                    <div key={commit.username}>
                                        <CommitCard
                                            Username={commit.username}
                                            Code={commit.code}
                                            IsFirst={isFirst}
                                            IsLast={isLast}
                                        />
                                    </div>
                                );
                            })}
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