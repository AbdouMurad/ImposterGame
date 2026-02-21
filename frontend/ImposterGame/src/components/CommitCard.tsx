type CommitCardProps = {
    Index: number;
    Username: string;
    IsFirst: boolean;
    IsLast: boolean;
    Highlight: boolean;
    HandleCommitClick: (index: number) => void;
};

export default function CommitCard({ Index, Username, IsFirst, IsLast, Highlight, HandleCommitClick }: CommitCardProps) {
    return (
        <>
            <div
                onClick={() => HandleCommitClick(Index)}
                className={`flex items-center w-60 h-15 border-x-2 border-t-2 border-gray-700 text-sm cursor-pointer
                    ${Highlight ? "bg-purple-950" : "bg-gray-900"}
                    ${IsFirst ? "rounded-t-md" : "rounded-t-none"}
                    ${IsLast ? "rounded-b-md" : "rounded-b-none"}
                    ${IsLast ? "border-b-2" : "border-b-none"}`}
            >
                <div className="m-2 text-gray-300">
                    {Username}
                    <div className="text-xs text-gray-500">
                        Commit #{Index + 1}
                    </div>
                </div>
            </div>
        </>
    );
}