

"use client"

import Chatpeople from "@/components/Chatpeople";

import { SessionProvider } from "next-auth/react";


export default function RootLayout({ children }) {
    return (
        // <html
        //     lang="en"
        //     className={` h-full`}
        // >
        //     <body className="min-h-full flex flex-col">
        //         <SessionProvider>

        //             <div className=" xl:w-200 lg:w-200   ">
        //                 <Chatpeople />
        //             </div>


        //             <div className="inset-0 fixed flex justify-center items-center bg-black/40 backdrop-blur-[2px]">
        //                 <div className="h-auto w-90 md:w-120 bg-white border border-gray-200 shadow-lg rounded-lg top-0 text-center relative">
        //                     {children}
        //                 </div>
        //             </div>
        //         </SessionProvider>


        //     </body>
        // </html>

        <html
              lang="en"
        
            >
        
              <body className="min-h-full flex flex-col">
                <div className="flex">
                  
                    <SessionProvider>
                    <div className="hidden 2xl:block lg:block xl:w-200 lg:w-200   ">
                        <Chatpeople/>
                    </div>
                    <div className="inset-0 fixed flex justify-center items-center bg-black/40 backdrop-blur-[2px]">
                         <div className="">
                             {children}
                        </div>
                     </div>
                  </SessionProvider>
                </div>
              </body>
            </html>
    );
}
