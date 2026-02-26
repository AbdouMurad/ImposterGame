import { useGame } from "../contexts/GameContext.tsx";

export default function ProblemPanel() {
    const {
        problemTitle,
        problemDescription,
        problemExamples,
        problemConstraints,
    } = useGame();

    return (
        <>
            <div className="w-[35%] bg-gray-950 rounded-xl my-3 border-2 border-gray-700">
                <h1 className="text-gray-200 font-bold m-7 text-2xl">
                    {problemTitle}
                </h1>
                <div className="text-gray-400 m-7">
                    {problemDescription}
                    <br />
                    <br />
                    <strong className="text-gray-300">Examples:</strong>
                    {problemExamples.map((example) => (
                        <div key={example} className="bg-gray-900 p-3 m-2 rounded-xl">
                            {example}
                        </div>
                    ))}
                    <br />
                    <strong className="text-gray-300">Constraints:</strong>
                    {problemConstraints.map((constraint) => (
                        <div key={constraint} className="bg-gray-900 p-3 m-2 rounded-xl">
                            {constraint}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}