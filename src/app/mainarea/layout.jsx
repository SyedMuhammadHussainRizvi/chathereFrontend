"use client"

import Chatpeople from "@/components/Chatpeople";
import { socket } from "@/lib/socket";

import {  useSession } from "next-auth/react";
import { useEffect } from "react";

export default function RootLayout({
  children,
}) {

  const {data: session, status} = useSession()


  useEffect(()=>{
    if(status!== "authenticated") return

    if(!socket.connected){
      socket.connect()
    }

    socket.emit("join", session?.user?.id)

    return ()=>{
      socket.disconnect()
    }

  }, [status, session])
  return (
    <html
      lang="en"

    >

      <body className="min-h-full flex flex-col">
        <div className="flex">
          
            
            <div className="hidden 2xl:block lg:block xl:w-200 lg:w-200   ">
                <Chatpeople/>
            </div>
            <div className="w-full bg-gray-100 text-black">

              {children}

            </div>
          
        </div>
      </body>
    </html>
  );
}
