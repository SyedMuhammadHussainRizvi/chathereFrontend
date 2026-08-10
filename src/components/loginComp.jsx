"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';

function loginComp() {

    const [contactNumber, setcontactNumber] = useState("")
    const [password, setpassword] = useState("")
    const router = useRouter()
    async function handleLogin(e) {
        e.preventDefault()
        try {
            const result = await signIn("credentials", {
                contactNumber,
                password,
                callbackUrl: ("/mainarea")
            })

            if (result?.error) {
                toast.error("Invalid credentials");
                setloginProcess(false)
            } else {
                toast.success("Login successfully");
                router.push("/mainarea");
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
    }
    return (
        <div className='w-full h-screen  flex items-center justify-center'>
            <ToastContainer position='top-center' />

            <div className="h-[70vh] px-20 bg-white rounded-lg w-150 flex items-center justify-center">
                <form onSubmit={handleLogin} >
                    <h1 className='text-center'>Login</h1><br /><br />
                    <label htmlFor="">Enter contact number</label><br />
                    <input type="text" className='border border-gray-300 rounded-lg w-80 h-10' value={contactNumber} onChange={(e)=>{setcontactNumber(e.target.value)}}/><br /><br />

                    <label htmlFor="">Enter password</label><br />
                    <input type="text" className='border border-gray-300 rounded-lg w-80 h-10' value={password} onChange={(e)=>{setpassword(e.target.value)}}/><br /><br />

                    <button type="submit" className='w-70 h-10 rounded-lg border border-gray-300'>Login</button>
                </form>
                <button className='w-50 h-10 rounded-lg border border-gray-300'>Sign up?</button>
            </div>

        </div>
    )
}

export default loginComp
