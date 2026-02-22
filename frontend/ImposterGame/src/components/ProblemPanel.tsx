import { useState } from "react";

type Example = {
    input: string;
    output: string;
}

export default function ProblemPanel() {
    //TODO : Add call to socket for problem info here
    const [title, setTitle] = useState<String>("Daily Temperatures");
    const [description, setDescription] = useState<string>(`You are given an array of integers temperatures where temperatures[i] represents the
        daily temperatures on the ith day. Return an array result where result[i] is the number
        of days after the ith day before a warmer temperature appears on a future day. If there
        is no day in the future where a warmer temperature will appear for the ith day, set result[i]
        to 0 instead.`);
    const [examples, setExamples] = useState<Example[]>([
        { input: "temperatures = [30,38,30,36,35,40,28]", output: "[1,4,1,2,1,0,0]" },
        { input: "temperatures = [22,21,20]", output: "[0,0,0]" }
    ]);
    const [constraints, setConstraints] = useState<string[]>([
        "1 <= temperatures.length <= 1000.",
        "1 <= temperatures[i] <= 100"
    ]);
    return (
        <>
            <div className="w-[35%] bg-gray-950 rounded-xl my-3 border-2 border-gray-700">
                <h1 className="text-gray-200 font-bold m-7 text-2xl">
                    {title}
                </h1>
                <p className="text-gray-400 m-7">
                    {description}
                    <br />
                    <br />
                    <strong className="text-gray-300">Examples:</strong>
                    {examples.map((example, index) => (
                        <div key={index} className="bg-gray-900 p-3 m-2 rounded-xl">
                            <div><strong>Input:</strong> {example.input}</div>
                            <div className="mt-2"><strong>Output:</strong> {example.output}</div>
                        </div>
                    ))}
                    <br />
                    <strong className="text-gray-300">Constraints:</strong>
                    {constraints.map((constraint) => (
                        <div key={constraint} className="bg-gray-900 p-3 m-2 rounded-xl">
                            {constraint}
                        </div>
                    ))}
                </p>
            </div>
        </>
    );
}