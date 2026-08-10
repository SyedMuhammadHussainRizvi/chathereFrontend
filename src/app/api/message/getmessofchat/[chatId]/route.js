import { connect } from "@/lib/mongodb";
import messages from "@/models/messages";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connect()

        const reqBody = await params
        const { chatId } = reqBody

        const findMessages = await messages.find({ chatId })
        if (!findMessages) {
            return NextResponse.json({
                success: false,
                message: "Message not found"
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: "Message found",
            findMessages
        }, { status: 200 })
        
    } catch (error) {
        return NextResponse.json({

            success: false,
            message: error.message
        }, { status: 500 })
    }
}