"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ProcessButton from './ProcessButton'
import { addChats, addGroup, getChats, getGroups } from '@/apiCall'
import { signOut, useSession } from 'next-auth/react'
import { toast, ToastContainer } from 'react-toastify'
import { FaUserCircle } from 'react-icons/fa'
import { FaCross, FaUsers, FaXmark } from 'react-icons/fa6'
import ChatsSkeleton from './ChatsSkeleton'

function Chatpeople() {

    const { data: session } = useSession()
    const router = useRouter()
    const [addchat, setaddchat] = useState(false)
    const [addgroup, setaddgroup] = useState(false)
    const [btnLoader, setbtnLoader] = useState(false)
    const [loadSkeleton, setloadSkeleton] = useState(false)
    const [contact, setcontact] = useState("")
    const [chats, setchats] = useState([])
    const [groups, setgroups] = useState([])
    const [showChatOption, setshowChatOption] = useState("Chats")
    const [groupMembers, setgroupMembers] = useState([{
        memId: "",
        memStatus: "",
    }])

    const [groupName, setgroupName] = useState("")
    const [groupDescription, setgroupDescription] = useState("")

    const [search, setsearch] = useState("")

    async function fetchChats() {
        setloadSkeleton(true)
        const response = await getChats(session?.user?.id)
        setloadSkeleton(false)
        if (response.success) {
            setchats(response?.findChats)
        } else {
            setchats([])
        }
    }

    async function fetchGroups() {
        setloadSkeleton(true)
        const response = await getGroups(session?.user?.id)
        setloadSkeleton(false)
        if (response.success) {
            setgroups(response?.findGroups)
        } else {
            setgroups([])
        }
    }

    useEffect(() => {
        if (session) {
            fetchChats()
            fetchGroups()
            setgroupMembers([{ memId: session?.user?.id, memStatus: "creator" }])
        }
    }, [session])
    console.log(chats)

    const result = chats?.filter(ch => ch?.chatMembers[0]?.name?.toLowerCase()?.includes(search) || ch?.lastMessage?.message?.toLowerCase()?.includes(search))

    const chatpeople = [
        {
            _id: "2934784989",
            picture: "/images/profile.png",
            name: "Hussain",
            contactNumber: "03703088940",
            lastmsg: "It's ok no worries",
            msgtime: "4:25"
        },

        {
            _id: "900",
            picture: "/images/profile.png",
            name: "",
            contactNumber: "0370308894",
            lastmsg: "It's ok no worries",
            msgtime: "4:25"
        }
    ]

    function openChat(chatId, name, image, memberId) {
        router.push(`/mainarea/chat/${chatId}?name=${encodeURIComponent(name)}&image=${encodeURIComponent(image)}&memberId=${encodeURIComponent(memberId)}`)
    }

    function openGroup(_id) {
        router.push(`/mainarea/group/${_id}`)
    }

    async function handleAddChat() {
        const payload = {
            myId: session?.user?.id,
            contactNumber: contact
        }

        setbtnLoader(true)
        const response = await addChats(payload);
        setbtnLoader(false)

        if (response.success) {
            toast.success(response.message)
            fetchChats()
            setaddchat(false)
            return
        }

        toast.error(response.message)
    }

    async function handleCreateGroup() {
        if(groupName.trim()=="" || groupDescription.trim()=="" || groupMembers.length<=2){
            toast.error("Please fill all fields")
            return
        }
        setbtnLoader(true)
        const payload={
          groupName: groupName,
          groupDescription: groupDescription,
          groupMembers: groupMembers,
          lastMessage: "6a744d716c109ee6b3c76079"
        }
        
        const response = await addGroup(payload)
        if(response.success){
            toast.success("Group has been created")
            setbtnLoader(false)
            return
        }

        toast.error(response.message)
        setbtnLoader(false)
    }
    console.log(groupMembers)
    function handleSignOut() {

        signOut()

    }
    return (
        <>
            <div className='h-screen bg-[#161717] text-white w-full px-5 py-10 flex flex-col'>
                <ToastContainer position='top-center' />

                <div className="flex justify-between">
                    <div>
                        <h1 className='font-bold text-[25px]'>{showChatOption}</h1>
                        <h1>{session?.user?.name}</h1>
                    </div>
                    <button onClick={() => { handleSignOut() }}>Logout</button>
                    <div className="h-10 w-10 rounded-full bg-[#0B895A] text-[35px] flex items-center justify-center text-white hover:cursor-pointer"
                        onClick={() => { showChatOption == "Chats" ? setaddchat(true) : setaddgroup(true) }}
                    >
                        +
                    </div>
                </div>
                <br />
                <input type="text" className='text-[#AAABAB] bg-[#2E2F2F] rounded-2xl w-full h-10 px-3 focus:outline-none'
                    value={search}
                    onChange={(e) => { setsearch(e.target.value) }}
                    placeholder='Search...' />
                <br /><br />

                <div className="flex gap-3">
                    <div className={`px-3 py-1 rounded-full border border-[#2E2F2F] text-[#AAABAB] hover:cursor-pointer hover:bg-[#2E2F2F] ${showChatOption == "Chats" && "bg-[#11432F] text-[#D9FDC9]"}`} onClick={() => { setshowChatOption("Chats") }}>Chats</div>
                    <div className={`px-3 py-1 rounded-full border border-[#2E2F2F] text-[#AAABAB] hover:cursor-pointer hover:bg-[#2E2F2F] ${showChatOption == "Groups" && "bg-[#11432F] text-[#D9FDC9]"}`} onClick={() => { setshowChatOption("Groups") }}>Groups</div>
                </div>
                <br />
                <div className="flex-1 min-h-0">
                    <div className="h-full overflow-y-auto
                        [&::-webkit-scrollbar]:w-1.5
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-[#3A3B3B]
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-[#555757]
                    ">
                        {
                            loadSkeleton ? (

                                < ChatsSkeleton />

                            ) : (
                                showChatOption == "Chats" ? (
                                    result?.map(person => (
                                        <div className="w-full flex gap-3 items-center relative px-5 py-5 hover:bg-[#2E2F2F] rounded-2xl" onClick={() => { openChat(person?._id, person?.chatMembers[0]?.name, "/images/profile.png", person?.chatMembers[0]?._id) }}>
                                            <Image src="/images/profile.png" width={60} height={60} className='rounded-full ' alt='profilephoto' />

                                            <div className="">
                                                <h1 className='text-[17px] font-semibold'>{person?.chatMembers[0]?.name != "" ? person?.chatMembers[0]?.name : person?.chatMembers[0]?.contactNumber}</h1>
                                                <p className='text-[#AAABAB] text-[14px]'>{(person?.lastMessage?.sender == session?.user?.id ? "You" : "other") + ": " + person?.lastMessage?.message}</p>
                                            </div>

                                            {/* <div className="absolute top-2 right-3 text-gray-600 text-[13px]"><p>{person?.msgtime}</p></div> */}
                                            <div className="absolute top-2 right-3 text-gray-600 text-[13px]"><p>4:25</p></div>
                                        </div>
                                    ))
                                ) : (
                                    groups?.map(grp => (
                                        <div className="w-full flex gap-3 items-center relative px-5 py-5 hover:bg-[#2E2F2F] rounded-2xl" onClick={() => { openGroup(grp?._id) }}>
                                            <Image src="/images/profile.png" width={60} height={60} className='rounded-full ' alt='profilephoto' />

                                            <div className="">
                                                <h1 className='text-[17px] font-semibold'>{grp?.groupName}</h1>
                                                <p className='text-[#AAABAB] text-[14px]'>{(grp?.lastMessage?.sender == session?.user?.id ? "You" : "other") + ": " + grp?.lastMessage?.message}</p>
                                            </div>

                                            {/* <div className="absolute top-2 right-3 text-gray-600 text-[13px]"><p>{person?.msgtime}</p></div> */}
                                            <div className="absolute top-2 right-3 text-gray-600 text-[13px]"><p>4:25</p></div>
                                        </div>
                                    ))
                                )
                            )
                        }
                    </div>
                </div>
            </div>

            {
                addchat ? (
                    <div className="inset-0 fixed flex justify-center items-center bg-black/40 backdrop-blur-[2px] z-10">


                        <div className="h-auto w-90 md:w-120 bg-white border border-gray-200 shadow-lg rounded-lg top-0 text-center relative">
                            <svg className="h-5 w-5 absolute top-2 right-2 hover:cursor-pointer bg-white rounded-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                                onClick={() => setaddchat(false)}>
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                            <h1 className='text-[25px] font-bold bg-[#1B6264] rounded-t-lg p-1 text-white'>Add to chat</h1><br />

                            <p className='text-[20px] font-semibold'>Enter contact number</p><br />
                            <input type="text" className='rounded-lg w-80 border border-gray-300 h-10 px-3 bg-[#F2F2F2]'
                                placeholder='Enter user contact number'
                                value={contact}
                                onChange={(e) => setcontact(e.target.value)}
                            />
                            <br /><br />

                            <ProcessButton height={10} width={"w-35"} bgcolor={" bg-red-400"}
                                loaderColor={"white"} loaderS={7}
                                txtColor={"white"} txtSize={"[20px]"}
                                loadingtxt={"Adding"} txt={"Add"} isLoading={btnLoader}
                                Onclick={handleAddChat}
                            />
                            <br /><br />
                        </div>

                    </div>
                ) : addgroup && (
                    <div className="inset-0 fixed flex justify-center items-center bg-black/40 backdrop-blur-[2px] z-10">


                        <div className="h-auto w-90 md:w-180 bg-white border border-gray-200 shadow-lg rounded-lg top-0 relative py-5 px-5 text-[15px] lg:text-[18px] 2xl:text-[20px]">
                            <svg className="h-5 w-5 absolute top-2 right-2 hover:cursor-pointer bg-white rounded-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                                onClick={() => setaddgroup(false)}>
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                            {/* <h1 className='text-[25px] font-bold bg-[#1B6264] rounded-t-lg p-1 text-white'>Add to chat</h1><br /> */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 rounded-full flex items-center justify-center bg-[#009C59] text-white text-[25px]"><FaUsers /></div>
                                <p className='font-bold '>Create New Group</p>
                            </div>

                            <p className=' font-semibold mb-1'>Group Name</p>
                            <input type="text" className='rounded-lg w-full border border-gray-300 h-10 2xl:h-13 px-3 bg-[#F2F2F2]'
                                placeholder='Enter group name'
                                value={groupName}
                                onChange={(e) => setgroupName(e.target.value)}
                            />
                            <br />

                            <p className=' font-semibold mb-1 mt-3 2xl:mt-6'>Group photo (optional)</p>
                            <div className="flex items-center gap-3">
                                <img src="/images/profile.png" className='w-15 h-15 rounded-full ' alt='groupphoto' />
                                <h1 className='text-[#009C59]'>Change group photo</h1>
                            </div>

                            <p className=' font-semibold mb-1 mt-3 2xl:mt-6'>Group Description</p>
                            <input type="text" className='rounded-lg w-full border border-gray-300 h-10 2xl:h-13 px-3 bg-[#F2F2F2]'
                                placeholder='Enter group name'
                                value={groupDescription}
                                onChange={(e) => setgroupDescription(e.target.value)}
                            />
                            <br />

                            <p className=' font-semibold mb-1 mt-3 2xl:mt-6'>Add Members</p>
                            <input type="text" className='rounded-lg w-full border border-gray-300 h-10 2xl:h-13 px-3 bg-[#F2F2F2]'
                                placeholder='Enter group name'
                                value={search}
                                onChange={(e) => setsearch(e.target.value)}
                            />
                            <br /><br />

                            <div className="grid grid-cols-1 md:grid-cols-2  max-h-30 overflow-y-auto">

                                {
                                    chats?.map(person => (
                                        <div className="w-full flex gap-3 items-center relative px-5 py-1 ">

                                            <input type="checkbox" className='h-6 w-6' style={{ accentColor: `#009C59` }}
                                                checked={groupMembers.find(gm => gm.memId == person?.chatMembers[0]?._id) ? true : false}
                                                onClick={() => {
                                                    const arr = [...groupMembers]
                                                    console.log(arr)
                                                    arr?.find(aa => aa.memId == person?.chatMembers[0]?._id) ? setgroupMembers(arr?.filter(a => a?.memId != person?.chatMembers[0]?._id)) :
                                                        setgroupMembers([...arr, { memId: person?.chatMembers[0]?._id, status: "user" }])
                                                }}
                                            />

                                            <Image src="/images/profile.png" width={50} height={50} className='rounded-full ' alt='profilephoto' />

                                            <div className="">
                                                <h1 className='text-[14px] sm:text-[15px] font-semibold'>{person?.chatMembers[0]?.name != "" ? person?.chatMembers[0]?.name : person?.chatMembers[0]?.contactNumber}</h1>
                                            </div>

                                        </div>
                                    ))
                                }

                            </div><br />

                            <h1 className='text-[20px] font-semibold'>Selected ({groupMembers?.length - 1})</h1>
                            <div className="w-full overflow-x-auto mb-3">
                                <div className="flex w-max items-center gap-3">
                                    {
                                        groupMembers.map((gm, index) => {
                                            if (index == 0) return null

                                            const arr = chats?.find(c => c?._id == gm?.memId)

                                            return (
                                                <div className='flex gap-2 p-2 bg-[#DBF6E5] text-[#009C59] items-center rounded-full'>
                                                    <p>{arr?.chatMembers[0]?.name}</p>
                                                    <FaXmark />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <ProcessButton height={10} width={"w-45"} bgcolor={"[#009C59]"}
                                    loaderColor={"white"} loaderS={7}
                                    txtColor={"white"} txtSize={"[20px]"}
                                    loadingtxt={"Creating"} txt={"Create group"} isLoading={btnLoader}
                                    Onclick={handleCreateGroup}
                                />
                            </div>

                        </div>

                    </div>
                )
            }
        </>
    )
}

export default Chatpeople
