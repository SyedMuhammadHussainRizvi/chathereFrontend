import { connect } from "@/lib/mongodb";
import chats from "@/models/chats";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connect()

        const reqBody = await req.json()

        const { myId, contactNumber } = reqBody
        
        const findPerson = await User.findOne({ contactNumber })

        if (!findPerson) {
            return NextResponse.json({
                success: false,
                message: "No person available with this contact number"
            }, { status: 400 })
        }

        const chatMembers = [myId, findPerson?._id]

        const findChat = await chats.findOne({
            chatMembers: {
                $all: chatMembers
            }
        })

        if (findChat) {
            return NextResponse.json({
                success: false,
                message: "This contact number is already saved"
            }, { status: 400 })
        }

        const addChat = new chats({
            chatMembers
        })

        const newChat = await addChat.save()

        return NextResponse.json({
            success: true,
            message: "This contact number is successfully added",
            newChat
        }, { status: 200 })

    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })

    }
}