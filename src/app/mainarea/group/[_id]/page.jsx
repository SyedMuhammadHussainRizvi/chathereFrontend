"use client"
import { deleteMess, getMessage, getoneGroup, sendMessage } from '@/apiCall'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { BsEmojiSmile, BsThreeDotsVertical } from 'react-icons/bs'
import { CiImageOn } from 'react-icons/ci'
import { FaAngleDown, FaAngleLeft, FaMagnifyingGlass, FaPhone, FaTrash } from 'react-icons/fa6'
import { IoIosSend, IoMdAttach } from 'react-icons/io'
import { IoVideocamOutline } from 'react-icons/io5'
import { toast, ToastContainer } from 'react-toastify'
import { socket } from '@/lib/socket'

function group() {

    const { data: session } = useSession()
    const router = useRouter()
    const messageEndRef = useRef(null);
    const params = useParams()
    const groupId = params._id
    const [groupDetails, setgroupDetails] = useState({})
    const [message, setMessage] = useState("")
    const [groupMessages, setgroupMessages] = useState([])
    const [OptionsDiv, setOptionsDiv] = useState(null)

    async function fetchgroup() {
        const response = await getoneGroup(groupId)
        if (response.success) {
            setgroupDetails(response.findGroup)
        }
    }

    async function getMessages() {
        const response = await getMessage(groupId)
        if (response.success) {
            setgroupMessages(response.findMessages)
            return
        }
        toast.error(response.message)
    }


    useEffect(() => {
        fetchgroup()
        getMessages()
    }, [])

    useEffect(() => {

        socket.emit("joinGroup", (groupId))

        const handleReceiveGroupMessage = (message) => {
            setgroupMessages((prev) => [...prev, message]);
        };

        const handleReceiveDeletedMessage = (message) => {
            setgroupMessages((prev) => prev.filter(pre => pre._id != message._id));
        };

        socket.on("receiveGroupMessage", (handleReceiveGroupMessage));
        socket.on("receiveDeletedMess", (handleReceiveDeletedMessage))

        return () => {
            socket.emit("leaveGroup", (groupId))
        }

    }, [])

    async function handleSendMessage() {
        const payload = {
            chatId: groupId,
            message: message,
            sender: session?.user?.id,
            receiver: session?.user?.id
        }

        const response = await sendMessage(payload)
        if (response.success) {
            socket.emit("sendGroupMeessage", response.saveMessage);
            setgroupMessages((prev) => [...prev, response.saveMessage])
            setMessage("")
        }
    }

    useEffect(()=>{
    
        messageEndRef.current?.scrollIntoView({
            behavior:"smooth"
        });
    
    },[groupMessages]);

    async function handleDelete(_id){
        const response = await deleteMess(_id)
        if(response.success){
            toast.success("Message deleted successfully")
            socket.emit("deleteMessage", response.deleteMessage);
            setgroupMessages(groupMessages.filter(gm => gm._id != _id))
            return
        }
        toast.error(response.message)
    }


    return (
        <div className='w-full h-full'>
            <ToastContainer />
            <div className="navbar w-full flex items-center justify-between px-3 lg:px-5 2xl:px-10  bg-[#161717] text-white h-[10vh]">

                <div className="flex gap-3 items-center">
                    <FaAngleLeft className='block sm:hidden text-[20px] hover:cursor-pointer ' onClick={() => { router.push("/mainarea") }} />
                    <img src={groupDetails?.groupImage} className='h-10 w-10 lg:h-10 lg:w-10 xl:h-13 xl:w-13 rounded-full' />
                    <div>
                        <h1 className='sm:text-[17px] lg:text-[20px] 2xl:text-[25px] font-semibold'>{groupDetails?.groupName}</h1>
                        <div className="flex gap-3 ">
                            <div className="flex gap-3 w-30 md:w-100 truncate">
                                {
                                    groupDetails?.groupMembers?.map(gd => (
                                        <p>{gd?.memId?.name + ","}</p>
                                    ))
                                }
                            </div>
                            <p>...</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 lg:gap-10 2xl:gap-10 text-[20px] items-center">
                    <FaMagnifyingGlass />
                    <IoVideocamOutline className='text-[27px]' />
                    <FaPhone />
                    <BsThreeDotsVertical />
                </div>

            </div>


            <div className="mainarea h-[90vh] bg-[#181919] px-3 sm:px-10 lg:px-10 2xl:px-20 ">

                <div className="messagearea h-[80vh] py-4 sm:py-4 lg:py-5 2xl:py-10 overflow-y-auto scrollbar-none">
                    {
                        groupMessages?.map(mess => (
                            <>
                                <div key={mess._id} className={`relative w-full flex mt-3 ${mess?.sender == (session?.user?.id) ? "justify-end" : "justify-start"}`}>
                                    <div className={`px-3 py-2 flex gap-3  ${mess?.sender == (session?.user?.id) ? "bg-[#144D37]" : "bg-[#242626]"} text-white rounded-lg rounded-b-r-none`}>
                                        <p className={`text-[20px] `}>{mess?.message}</p>
                                        <div className= {`items-end ${mess?.sender != (session?.user?.id) && "mt-3"}`}>
                                            {
                                                mess?.sender == (session?.user?.id) ? 
                                                <div className="flex justify-end"><FaAngleDown onClick={()=>setOptionsDiv(
                                                OptionsDiv === mess._id ? null : mess._id
                                                )}/></div>
                                                 : ""
                                            }
                                            <p className='text-[#AAABAB] '>{new Date(mess.createdAt).toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true
                                        })}</p></div>
                                    </div>
                                    {
                                        OptionsDiv==mess._id && (
                                            <div className="absolute bottom-16 rounded-lg p-3 px-5 bg-[#161717]">
                                                <div className="flex items-center gap-3 rounded-lg p-2 text-white hover:text-red-400 hover:bg-red-200 hover:cursor-pointer" onClick={()=>handleDelete(mess._id)}>
                                                    <FaTrash/>
                                                    <p>Delete</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <div ref={messageEndRef}></div>
                            </>
                        ))
                    }
                </div>

                <div className="typearea h-[7vh] flex justify-center items-center ">
                    <div className="bg-[#2E2F2F] text-white w-full h-[6vh] lg:h-full xl:h-full 2xl:h-full flex justify-between rounded-full items-center px-5 text-[25px] sm:text-[30px] lg:text-[20px] 2xl:text-[30px]">
                        <div className='flex gap-2 items-center'>
                            <BsEmojiSmile />
                            <input type="text" className=' flex-1 w-full focus:outline-none px-3 text-[18px]' placeholder='Type message...' value={message} onChange={(e) => setMessage(e.target.value)} />
                        </div>
                        <div className="flex gap-5 items-center">
                            <IoMdAttach />
                            <CiImageOn />
                            <button className='flex items-center justify-center p-1.5 lg:p-1.5 2xl:p-1.5 rounded-full bg-blue-300' onClick={() => { handleSendMessage() }}><IoIosSend /></button>
                        </div>

                    </div>
                </div>

            </div>




        </div>
    )
}

export default group
