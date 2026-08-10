import { connect } from "@/lib/mongodb";
import messages from "@/models/messages";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    try {
        await connect()

        const { _id } = await params

        const deleteMessage = await messages.findByIdAndDelete({ _id })
        if (!deleteMessage) {
            return NextResponse.json({
                success: false,
                message: "Message not deleted"
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: "Message deleted",
            deleteMessage
        }, { status: 200 })

    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}