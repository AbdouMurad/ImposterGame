export default function Problem() {
    return (
        <>
            <div className="w-[35%] bg-gray-950 rounded-xl my-3 border-2 border-gray-700">
                <h1 className="text-gray-200 font-bold m-7 text-2xl">
                    Daily Temperatures
                </h1>
                <p className="text-gray-400 m-7">
                    You are given an array of integers temperatures where temperatures[i] represents the
                    daily temperatures on the ith day. Return an array result where result[i] is the number
                    of days after the ith day before a warmer temperature appears on a future day. If there
                    is no day in the future where a warmer temperature will appear for the ith day, set result[i]
                    to 0 instead.
                    <br />
                    <br />
                    Examples:
                    <div className="bg-gray-900 p-3 m-2 rounded-xl">
                        Input: temperatures = [30,38,30,36,35,40,28]
                        <br />
                        <br />
                        Output: [1,4,1,2,1,0,0]
                    </div>
                    <div className="bg-gray-900 p-3 m-2 rounded-xl">
                        Input: temperatures = [22,21,20]
                        <br />
                        <br />
                        Output: [0,0,0]
                    </div>
                    Constraints:
                    <div className="bg-gray-900 p-3 m-2 rounded-xl">
                        {"1 <= temperatures.length <= 1000."}
                        <br />
                        <br />
                        {"1 <= temperatures[i] <= 100"}
                    </div>
                </p>
            </div>
        </>
    );
}