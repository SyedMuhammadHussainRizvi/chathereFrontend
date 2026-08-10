"use client"
import { addUser } from '@/apiCall';
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';

function login() {

    const [contactNumber, setcontactNumber] = useState("")
    const [password, setpassword] = useState("")
    const [name, setName] = useState("")
    const router = useRouter()
    async function handleSignup(e) {
        e.preventDefault()
        if(name.trim()=="" || contactNumber.trim()=="" || password.trim()=="" ){
            toast.warning("Please enter all credentials")
            return
        }
        const payload = {
            name: name,
            contactNumber: contactNumber,
            password: password
        }
        const response = await addUser(payload)
        if(response.success){
            toast.success("Successfully signup")
            router.push("/logsignup/login")
            return
        }
        toast.error(response.message)
    }
    return (
        <div className='w-full h-screen  flex items-center justify-center'>
            <ToastContainer position='top-center' />

            


    <div className="w-90 md:w-150  bg-[#202C33] rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-[#144D37] flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                    C
                </span>
            </div>

            <h1 className="text-3xl font-bold text-white">
                Create Account
            </h1>

            <p className="text-[#8696A0] mt-2 text-sm">
                Create your account and start chatting
            </p>
        </div>


        <form onSubmit={handleSignup} className="space-y-5">

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-[#D1D7DB] mb-2">
                    Your name
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="
                        w-full h-12 px-4
                        rounded-xl
                        bg-[#111B21]
                        border border-[#374045]
                        text-white
                        placeholder-[#667781]
                        outline-none
                        focus:border-[#00A884]
                        transition
                    "
                />
            </div>


            {/* Contact */}
            <div>
                <label className="block text-sm font-medium text-[#D1D7DB] mb-2">
                    Contact number
                </label>

                <input
                    type="Number"
                    value={contactNumber}
                    onChange={(e) => setcontactNumber(e.target.value)}
                    placeholder="03XX XXXXXXX"
                    className="
                        w-full h-12 px-4
                        rounded-xl
                        bg-[#111B21]
                        border border-[#374045]
                        text-white
                        placeholder-[#667781]
                        outline-none
                        focus:border-[#00A884]
                        transition
                    "
                />
            </div>


            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-[#D1D7DB] mb-2">
                    Password
                </label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    placeholder="Enter your password"
                    className="
                        w-full h-12 px-4
                        rounded-xl
                        bg-[#111B21]
                        border border-[#374045]
                        text-white
                        placeholder-[#667781]
                        outline-none
                        focus:border-[#00A884]
                        transition
                    "
                />
            </div>


            {/* Signup */}
            <button
                type="submit"
                className="
                    w-full h-12
                    rounded-xl
                    bg-[#00A884]
                    hover:bg-[#06B98F]
                    text-white
                    font-semibold
                    transition
                    duration-200
                    active:scale-[0.98]
                "
            >
                Create Account
            </button>

        </form>


        {/* Login */}
        <div className="text-center mt-7">

            <span className="text-[#8696A0] text-sm">
                Already have an account?
            </span>

            <button
                type="button"
                onClick={() => router.push("/logsignup/login")}
                className="
                    ml-2
                    text-[#00A884]
                    hover:text-[#06B98F]
                    font-semibold
                    text-sm
                    transition
                "
            >
                Log in
            </button>

        </div>

    </div>





        </div>
    )
}

export default login
