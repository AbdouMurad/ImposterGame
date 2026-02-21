import Editor from "@monaco-editor/react";

import { useState } from "react";

export default function Game() {
    return (
        <>
            <div className="w-[50%] rounded-xl bg-gray-950 border-2 border-gray-700 m-3">
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
                </div>
            </div>
        </>
    );
}