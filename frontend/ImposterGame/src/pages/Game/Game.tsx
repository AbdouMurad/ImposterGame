import Editor from "@monaco-editor/react";
import UserList from "../../components/UserList/UserList.tsx";
import Problem from "../../components/Problem/Problem.tsx";

export default function Game() {
    return (
        <>
            <div className="h-screen bg-gray-900">
                <div className="flex">
                    <h1 className="text-purple-700 text-xl font-bold m-5">
                        Cheet
                        <strong className="text-white">Code</strong>
                    </h1>
                </div>
                <div className="flex flex-1">
                    <UserList />
                    <Problem />
                    <Editor
                        height="700px"
                        width="50%"
                        defaultLanguage="python"
                        defaultValue="// Start coding..."
                        theme="vs-dark"
                        className="w-[50%] bg-black border-2 border-gray-700 rounded-xl m-3"
                    />
                </div>
            </div >
        </>
    );
}