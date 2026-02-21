import { User } from "lucide-react"; export default function UserList() {

    return (
        <>
            <div className="w-[15%] bg-gray-950 my-3 mr-15 border-y-2 border-r-2 border-gray-700">
                <div className="flex text-white mr-5 my-5 p-3 rounded-r-xl bg-gray-900">
                    <User />
                    James
                </div>
                <div className="flex text-white mr-5 my-5 p-3 rounded-r-xl bg-gray-900">
                    <User />
                    Abdou
                </div>
                <div className="flex text-white mr-5 my-5 p-3 rounded-r-xl bg-gray-900">
                    <User />
                    Kevin
                </div>
                <div className="flex text-white mr-5 my-5 p-3 rounded-r-xl bg-gray-900">
                    <User />
                    Paolo
                </div>
                <div className="flex text-white mr-5 my-5 p-3 rounded-r-xl bg-gray-900">
                    <User />
                    Lem
                </div>
            </div>
        </>
    );
}

