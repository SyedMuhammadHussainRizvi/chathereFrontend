import { connect } from "@/lib/mongodb";
import chats from "@/models/chats";
import { NextResponse } from "next/server";
import messages from "@/models/messages";
import User from "@/models/User";

export async function GET(req, { params }) {
    try {
        await connect()

        const reqBody = await params
        const { _id } = reqBody

        const findChats = await chats.find({
            chatMembers: {
                $in: _id
            }
        }).populate("chatMembers").populate("lastMessage")

        if (!findChats) {
            return NextResponse.json({
                success: false,
                message: "No chats"
            }, { status: 400 })
        }

        const chatUsers = findChats.map(us => (
            us.chatMembers=us.chatMembers.filter(cm => cm._id != _id)
        ))

        return NextResponse.json({
            success: true,
            message: "Chats are Successfully fetched",
            findChats
        }, { status: 200 })
    } catch (error) {

        console.log(error.message)
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}