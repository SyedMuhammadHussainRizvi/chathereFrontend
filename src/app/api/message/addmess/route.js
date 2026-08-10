import { connect } from "@/lib/mongodb"
import chats from "@/models/chats"
import messages from "@/models/messages"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        await connect()
        const reqBody = await req.json()
        const { chatId, message, sender, receiver } = reqBody

        const sendMessage = new messages({
            chatId,
            message,
            sender,
            receiver
        })

        const saveMessage = await sendMessage.save()

        if (!saveMessage) {
            return NextResponse.json({
                success: false,
                message: "Message not sent"
            }, { status: 400 })
        }

        const lastMessage = saveMessage._id
        const _id = chatId

        const updateChatLastMessage = await chats.findByIdAndUpdate({ _id }, {
            lastMessage
        }, {
            new: true,
            overwrite: true,
            runValidators: true
        })

        return NextResponse.json({
            success: true,
            message: "message sent",
            saveMessage
        }, { status: 200 })
    } catch (error) {

        return NextResponse.json({

            success: false,
            message: error.message
        }, { status: 500 })
    }
}