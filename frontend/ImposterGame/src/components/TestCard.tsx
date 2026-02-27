import { Check, X } from "lucide-react";

type TestCardProps = {
    index: number;
    highlight: boolean;
    handleCardClick: (index: number) => void;
}

export default function TestCard({ index, highlight, handleCardClick }: TestCardProps) {
    return (
        <>
            <div
                className={`text-gray-300 m-3 py-2 px-5 rounded-xl cursor-pointer ${highlight ? "bg-gray-800" : "bg-gray-950"} ${highlight ? "hover:bg-gray-800" : "hover:bg-gray-900"}`}
                onClick={() => handleCardClick(index)}
            >
                Test {index + 1}
            </div>
        </>
    );
}