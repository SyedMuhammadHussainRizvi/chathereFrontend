"use client"
import { useSession } from 'next-auth/react'
import React from 'react'
import { FaComputer } from "react-icons/fa6";
import Image from 'next/image';
import Chatpeople from '@/components/Chatpeople';
import loginComp from '@/components/loginComp';

function page() {
    const {data: session} = useSession()
  return (
    <div className='w-full h-screen bg-[#F7F5F3] flex items-center justify-center'>
        <div className="w-140 h-120 rounded-lg bg-white flex justify-center items-center hidden sm:block">
            <div className='px-15'>
                <Image src="/images/whatsappimage.png" width={150} height={150} className='justify-self-center'/><br />
                <h1 className='text-[25px] font-bold justify-self-center'>Download Whatsapp</h1>
                <h1 className='text-[25px] font-bold justify-self-center'>for Windows</h1><br />
                <p className='text-gray-600 justify-self-center'>Get extra features like voice and video calling, </p>
                <p className='text-gray-600 justify-self-center'>screen sharing and more.</p>
            </div>
        </div>

        <div className='w-full block sm:hidden'>
            <Chatpeople/>
        </div>

        
    </div>
  )
}

export default page
