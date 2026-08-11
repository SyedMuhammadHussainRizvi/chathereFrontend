"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { FaAngleDown, FaAngleLeft, FaMagnifyingGlass, FaPhone, FaTrash, FaVideo } from 'react-icons/fa6'
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoVideocamOutline } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { IoMdAttach } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { deleteMess, getMessage, sendMessage } from '@/apiCall'
import { toast, ToastContainer } from 'react-toastify'
import { useSession } from 'next-auth/react'
import { socket } from '@/lib/socket'
import { useRouter } from 'next/navigation'

function chat() {
  const router = useRouter()
  const { data: session } = useSession()
  const [chatMessages, setchatMessages] = useState()
  const params = useParams()
  const messageEndRef = useRef(null);
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("")
  const [OptionsDiv, setOptionsDiv] = useState(null)
  const [isOnline, setisOnline] = useState(false)
  const [istyping, setistyping] = useState(false)
  const typingTimeout = useRef(null)

  const myid = session?.user?.id

  const chatId = params._id;
  const name = searchParams.get("name");
  const image = searchParams.get("image");
  const memberId = searchParams.get("memberId");

  async function getMessages() {
    const response = await getMessage(chatId)
    if (response.success) {
      setchatMessages(response.findMessages)
      return
    }
    toast.error(response.message)
  }

  useEffect(() => {
    getMessages()
  }, [])

  useEffect(() => {

    const handleOnline = (userId)=>{
      if(memberId == userId){
        setisOnline(true)
      }
    }

    const handleOffline = (userId)=>{
      if(memberId == userId){
        setisOnline(false)
      }
    }

    socket.on("onlineUser", handleOnline)
    socket.on("offlineUser", handleOffline)

    socket.on("receiveMessage", (message) => {
      setchatMessages((prev) => [...prev, message])
    })

    const handleReceiveDeletedMessage = (message) => {
      setchatMessages((prev) => prev.filter(pre => pre._id != message._id));
    };

    socket.on("receiveDeletechatMessage", (handleReceiveDeletedMessage))

  }, [])

  useEffect(() => {
    console.log("Socket connected:", socket.connected);
    const handleUserTyping = ({ userId, chatid }) => {
        if (
            userId.toString() === myid?.toString() &&
            chatid.toString() === chatId?.toString()
        ) {
            console.log(name+" is typing");
            setistyping(true)
          }else{
            console.log("Do something else");
          }
        };
        socket.on("userTyping", handleUserTyping);

        const handleUsernotTyping = ({userId, chatid}) => {
          if (
            userId.toString() === myid?.toString() &&
            chatid.toString() === chatId?.toString()
          ){
            setistyping(false)
          }
        }

        socket.on("usernotTyping", handleUsernotTyping)

    return () => {
        socket.off("userTyping", handleUserTyping);
        
    };
}, [memberId, chatId]);

  async function handleSendMessage() {
    const payload = {
      chatId: chatId,
      message: message,
      sender: session?.user?.id,
      receiver: memberId
    }

    const response = await sendMessage(payload)
    if (response.success) {
      socket.emit("sendMessage", response.saveMessage);
      setchatMessages((prev) => [...prev, response.saveMessage])
      setMessage("")
    }
  }

  useEffect(() => {

    messageEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [chatMessages, istyping]);

  async function handleDelete(_id) {
    const response = await deleteMess(_id)
    if (response.success) {
      toast.success("Message deleted successfully")
      setchatMessages(chatMessages.filter(cm => cm._id != _id))
      socket.emit("deletechatMessage", response.deleteMessage);
      return
    }
    toast.error(response.message)
  }

  function handleTyping(e){
    setMessage(e.target.value)

    socket.emit("typing", {
      userId: memberId, 
      chatid: chatId
    })

    clearTimeout(typingTimeout.current)

    typingTimeout.current=setTimeout(()=>{
      socket.emit("nottyping", {
        userId: memberId,
        chatid: chatId
      })
    }, 1000)

  }

  return (
    <div className='w-full h-screen '>
      <ToastContainer />
      <div className="navbar w-full flex items-center justify-between px-3 lg:px-5 2xl:px-10  bg-[#161717] text-white h-[10vh]">

        <div className="flex gap-3 items-center">
          <FaAngleLeft className='block sm:hidden text-[20px] hover:cursor-pointer ' onClick={() => { router.push("/mainarea") }} />
          <img src={image} className='h-10 w-10 lg:h-10 lg:w-10 xl:h-13 xl:w-13 rounded-full' />
          <div>
            <h1 className='sm:text-[17px] lg:text-[20px] 2xl:text-[25px] font-semibold'>{name}</h1>
            <p>{isOnline ? "Online" : "Offline"}</p>
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
            chatMessages?.map(mess => (
              <>
                <div className={`relative w-full flex mt-3 ${(mess?.sender?._id || mess?.sender) === myid ? "justify-end" : "justify-start"}`}>
                  <div className={`px-3 py-2 flex gap-3  ${(mess?.sender?._id || mess?.sender) === myid ? "bg-[#144D37]" : "bg-[#242626]"} text-white rounded-lg rounded-b-r-none`}>
                    <p className={`text-[17px] md:text-[20px] `}>{mess?.message}</p>
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
            istyping && (
              <div className="flex gap-3 bg-[#242626] px-2 py-4 rounded-lg mt-3 w-fit">
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
              <input type="text" className='flex-1 w-full focus:outline-none px-3 text-[18px]' placeholder='Type message...' value={message} onChange={(e) => {handleTyping(e)}} />
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

export default chat
