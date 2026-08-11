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
    const [groupInfo, setgroupInfo] = useState(false)
    const [istyping, setistyping] = useState("")
    const typingTimeout = useRef(null)


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
        socket.emit("joinGroup", groupId);

        const handleReceiveGroupMessage = (message) => {
            setgroupMessages((prev) => [...prev, message]);
        };

        const handleReceiveDeletedMessage = (message) => {
            setgroupMessages((prev) =>
                prev.filter((pre) => pre._id !== message._id)
            );
        };

        socket.on("receiveGroupMessage", handleReceiveGroupMessage);
        socket.on("receiveDeletedMess", handleReceiveDeletedMessage);

        return () => {
            socket.emit("leaveGroup", groupId);
            socket.off("receiveGroupMessage", handleReceiveGroupMessage);
            socket.off("receiveDeletedMess", handleReceiveDeletedMessage);
        };
    }, [groupId]);

    async function handleSendMessage() {
        const payload = {
            chatId: groupId,
            message: message,
            sender: session?.user?.id,
            receiver: session?.user?.id,
        };

        const response = await sendMessage(payload);

        if (response.success) {
            // Add your own message immediately
            setgroupMessages((prev) => [
                ...prev,
                {
                    ...response.saveMessage,
                    senderName: session?.user?.name,
                },
            ]);

            // Send name through socket
            socket.emit("sendGroupMeessage", {
                ...response.saveMessage,
                senderName: session?.user?.name,
            });

            setMessage("");
        }
    }

    useEffect(() => {

        messageEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [groupMessages, istyping]);

    async function handleDelete(_id) {
        const response = await deleteMess(_id)
        if (response.success) {
            toast.success("Message deleted successfully")
            socket.emit("deleteMessage", response.deleteMessage);
            setgroupMessages(groupMessages.filter(gm => gm._id != _id))
            return
        }
        toast.error(response.message)
    }

    useEffect(() => {
        console.log("Socket connected:", socket.connected);

        const handleUserTyping = ({ userName, chatid }) => {
            console.log("I am here")
            if (
                chatid.toString() === groupId?.toString()
            ) {
                console.log(userName)
                setistyping(userName)
            } else {
                console.log("Do something else");
            }
        };

        socket.on("userTypingGroup", handleUserTyping);

        const handleUsernotTyping = ({ userName, chatid }) => {
            if (
                chatid.toString() === groupId?.toString()
            ) {
                setistyping("")
            }
        }

        socket.on("usernotTypingGroup", handleUsernotTyping)

        return () => {
            socket.off("userTypingGroup", handleUserTyping);

        };
    }, [groupId]);


    function handleTyping(e) {
        setMessage(e.target.value)

        socket.emit("typingGroup", {
            userName: session?.user?.name,
            chatid: groupId
        })

        clearTimeout(typingTimeout.current)

        typingTimeout.current = setTimeout(() => {
            socket.emit("nottypingGroup", {
                userName: session?.user?.name,
                chatid: groupId
            })
        }, 1000)

    }


    return (
        <div className='w-full h-full'>
            <ToastContainer />
            <div className="navbar w-full flex items-center justify-between px-3 lg:px-5 2xl:px-10  bg-[#161717] text-white h-[10vh]">

                <div className="flex gap-3 items-center hover:cursor-pointer" onClick={() => setgroupInfo(true)}>
                    <FaAngleLeft className='block sm:hidden text-[20px] hover:cursor-pointer ' onClick={(e) => { e.stopPropagation(); router.push("/mainarea") }} />
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


            <div className="mainarea h-[90vh] bg-[#181919] px-3 sm:px-10 lg:px-10 2xl:px-20 relative">

                <div className="messagearea h-[80vh] py-4 sm:py-4 lg:py-5 2xl:py-10 overflow-y-auto scrollbar-none">
                    {
                        groupMessages?.map(mess => (
                            <>
                                <div key={mess._id} className={`relative w-full flex mt-3 ${(mess?.sender?._id || mess?.sender) === (session?.user?.id) ? "justify-end" : "justify-start"}`}>
                                    <div className={`px-3 py-2 flex gap-3  ${(mess?.sender?._id || mess?.sender) == (session?.user?.id) ? "bg-[#144D37]" : "bg-[#242626]"} text-white rounded-lg rounded-b-r-none`}>
                                        <div>
                                            <p className={`text-[17px] md:text-[20px] text-[#F9CD77]`}>
                                                {(mess?.sender?._id || mess?.sender) !== session?.user?.id &&
                                                    (mess?.sender?.name || mess?.senderName)}
                                            </p>
                                            <p className={`text-[15px] md:text-[20px]`}>{mess?.message}</p>
                                        </div>
                                        <div className={`items-end ${(mess?.sender?._id || mess?.sender) != (session?.user?.id) && "mt-3"}`}>
                                            {
                                                (mess?.sender?._id || mess?.sender) == (session?.user?.id) ?
                                                    <div className="flex justify-end"><FaAngleDown onClick={() => setOptionsDiv(
                                                        OptionsDiv === mess._id ? null : mess._id
                                                    )} /></div>
                                                    : ""
                                            }
                                            <p className='text-[#AAABAB] '>{new Date(mess.createdAt).toLocaleTimeString([], {
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true
                                            })}</p></div>
                                    </div>
                                    {
                                        OptionsDiv == mess._id && (
                                            <div className="absolute bottom-16 rounded-lg p-3 px-5 bg-[#161717]">
                                                <div className="flex items-center gap-3 rounded-lg p-2 text-white hover:text-red-400 hover:bg-red-200 hover:cursor-pointer" onClick={() => handleDelete(mess._id)}>
                                                    <FaTrash />
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
                    {
                        istyping != "" && (
                            <div className="bg-[#242626] px-2 py-3 rounded-lg mt-3 w-fit flex gap-3 items-center">
                                <div className='mb-3 text-[#F9CD77]'>{istyping}</div>
                                <div className="h-3 w-3 animate-bounce rounded-full bg-white"></div>
                                <div className="h-3 w-3 animate-bounce rounded-full bg-white"></div>
                                <div className="h-3 w-3 animate-bounce rounded-full bg-white"></div>
                            </div>
                        )
                    }
                </div>

                <div className="typearea h-[7vh] flex justify-center items-center ">
                    <div className="bg-[#2E2F2F] text-white w-full h-[6vh] lg:h-full xl:h-full 2xl:h-full flex justify-between rounded-full items-center px-5 text-[25px] sm:text-[30px] lg:text-[20px] 2xl:text-[30px]">
                        <div className='flex gap-2 items-center'>
                            <BsEmojiSmile />
                            <input type="text" className=' flex-1 w-full focus:outline-none px-3 text-[18px]' placeholder='Type message...' value={message} onChange={(e) => { handleTyping(e) }} />
                        </div>
                        <div className="flex gap-5 items-center">
                            <IoMdAttach />
                            <CiImageOn />
                            <button className='flex items-center justify-center p-1.5 lg:p-1.5 2xl:p-1.5 rounded-full bg-blue-300' onClick={() => { handleSendMessage() }}><IoIosSend /></button>
                        </div>

                    </div>
                </div>

                {
                    groupInfo && (
                        <div className="absolute p-5 rounded-lg bg-black top-0 left-10 text-white max-w-85">
                            <svg className="h-5 w-5 absolute top-2 right-2 hover:cursor-pointer bg-white rounded-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                                onClick={() => setgroupInfo(false)}>
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                            <p>Your group says: {groupDetails?.groupDescription}</p>
                            {
                                groupDetails?.groupMembers?.map(gd => (
                                    <div className="flex items-center gap-3 mt-5">
                                        <img src="/images/profile.png" alt="" className='h-10 w-10 rounded-full' />
                                        <p>{gd?.memId?.name}</p>
                                    </div>

                                ))
                            }

                        </div>
                    )
                }

            </div>




        </div>
    )
}

export default group
