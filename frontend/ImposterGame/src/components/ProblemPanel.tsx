import { useState } from "react";

type ProblemPanelProps = {
    Title: string;
    Description: string;
    Examples: string[];
}

export default function ProblemPanel({ Title, Description, Examples }: ProblemPanelProps) {
    return (
        <>
            <div className="w-[35%] bg-gray-950 rounded-xl my-3 border-2 border-gray-700">
                <h1 className="text-gray-200 font-bold m-7 text-2xl">
                    {Title}
                </h1>
                <div className="text-gray-400 m-7">
                    {Description}
                    <br />
                    <br />
                    {/* <strong className="text-gray-300">Examples:</strong> */}
                    <div className="whitespace-pre-line">
                        {Examples}
                    </div>
                    {/* {Examples.map((example) => (
                        <div key={example} className="bg-gray-900 p-3 m-2 rounded-xl">
                            {example}
                        </div>
                    ))} */}
                    {/* <br />
                    <strong className="text-gray-300">Constraints:</strong>
                    {constraints.map((constraint) => (
                        <div key={constraint} className="bg-gray-900 p-3 m-2 rounded-xl">
                            {constraint}
                        </div>
                    ))} */}
                </div>
            </div>
        </>
    );
}