import { useState, useEffect } from "react";

import { GripHorizontal } from "lucide-react";

type ConsolePanelProps = {
    height: number;
    onResize: (newHeight: number) => void;
};

export default function ConsolePanel({ height, onResize }: ConsolePanelProps) {
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing) {
            const newHeight = Math.min(500, Math.max(100, height - e.movementY));
            onResize(newHeight);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        // Cleanup event listeners when the component unmounts or `isResizing` changes
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    return (
        <>
            <div
                className="bg-gray-950 text-gray-200 border-t-2 border-gray-700"
                style={{ height: `${height}px` }}
            >
                <div
                    className="flex justify-center cursor-row-resize bg-gray-800 h-1"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                >
                    <GripHorizontal />
                </div>
                <div className="p-3">
                    <div className="m-2 text-gray-200 text-xl font-bold">
                        Test Cases
                    </div>
                </div>
            </div>
        </>
    );
}