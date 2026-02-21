type CommitCardProps = {
    Username: string;
    Code: string,
    IsFirst: boolean;
    IsLast: boolean
};

export default function CommitCard({ Username, Code, IsFirst, IsLast }: CommitCardProps) {
    return (
        <>
            <div
                className={`flex items-center w-60 h-15 border-x-2 border-t-2 border-gray-700 text-sm bg-gray-900
                    ${IsFirst ? "rounded-t-md" : "rounded-t-none"}
                    ${IsLast ? "rounded-b-md" : "rounded-b-none"}
                    ${IsLast ? "border-b-2" : "border-b-none"}`}
            >
                <div className="m-2 text-gray-300">
                    {Username}
                </div>
            </div>
        </>
    );
}