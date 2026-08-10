import React from 'react'

function ChatsSkeleton() {
    return (
        <div className='w-full  px-5 py-10'>

            <div className="w-full flex gap-3 items-center relative px-5 py-5 hover:bg-[#2E2F2F] rounded-2xl">
                <div className="h-20 w-20 rounded-full bg-gray-300 animate-pulse"></div>

                <div className="flex-1">
                    <div className='w-full rounded-lg h-5 bg-gray-300 text-white animate-pulse'></div><br />
                    <div className='w-full rounded-lg h-3 bg-gray-300 animate-pulse'></div>
                </div>

                {/* <div className="absolute top-2 right-3 text-gray-600 text-[13px]"><p>{person?.msgtime}</p></div> */}
                <div className="absolute top-2 right-3 h-3 w-6 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>

            <div className="w-full flex gap-3 items-center relative px-5 py-5 hover:bg-[#2E2F2F] rounded-2xl">
                <div className="h-20 w-20 rounded-full bg-gray-300 animate-pulse"></div>

                <div className="flex-1">
                    <div className='w-full rounded-lg h-5 bg-gray-300 text-white animate-pulse'></div><br />
                    <div className='w-full rounded-lg h-3 bg-gray-300 animate-pulse'></div>
                </div>

                {/* <div className="absolute top-2 right-3 text-gray-600 text-[13px]"><p>{person?.msgtime}</p></div> */}
                <div className="absolute top-2 right-3 h-3 w-6 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>

            <div className="w-full flex gap-3 items-center relative px-5 py-5 hover:bg-[#2E2F2F] rounded-2xl">
                <div className="h-20 w-20 rounded-full bg-gray-300 animate-pulse"></div>

                <div className="flex-1">
                    <div className='w-full rounded-lg h-5 bg-gray-300 text-white animate-pulse'></div><br />
                    <div className='w-full rounded-lg h-3 bg-gray-300 animate-pulse'></div>
                </div>

                {/* <div className="absolute top-2 right-3 text-gray-600 text-[13px]"><p>{person?.msgtime}</p></div> */}
                <div className="absolute top-2 right-3 h-3 w-6 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>

            <div className="w-full flex gap-3 items-center relative px-5 py-5 hover:bg-[#2E2F2F] rounded-2xl">
                <div className="h-20 w-20 rounded-full bg-gray-300 animate-pulse"></div>

                <div className="flex-1">
                    <div className='w-full rounded-lg h-5 bg-gray-300 text-white animate-pulse'></div><br />
                    <div className='w-full rounded-lg h-3 bg-gray-300 animate-pulse'></div>
                </div>

                {/* <div className="absolute top-2 right-3 text-gray-600 text-[13px]"><p>{person?.msgtime}</p></div> */}
                <div className="absolute top-2 right-3 h-3 w-6 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>

            <div className="w-full flex gap-3 items-center relative px-5 py-5 hover:bg-[#2E2F2F] rounded-2xl">
                <div className="h-20 w-20 rounded-full bg-gray-300 animate-pulse"></div>

                <div className="flex-1">
                    <div className='w-full rounded-lg h-5 bg-gray-300 text-white animate-pulse'></div><br />
                    <div className='w-full rounded-lg h-3 bg-gray-300 animate-pulse'></div>
                </div>

                {/* <div className="absolute top-2 right-3 text-gray-600 text-[13px]"><p>{person?.msgtime}</p></div> */}
                <div className="absolute top-2 right-3 h-3 w-6 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
        </div>
    )
}

export default ChatsSkeleton
