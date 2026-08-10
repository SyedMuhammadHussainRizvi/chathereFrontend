import { connect } from "@/lib/mongodb";
import Group from "@/models/Group";
import { NextResponse } from "next/server";
import messages from "@/models/messages";
import User from "@/models/User";

export async function GET(req, { params }) {
    try {
        await connect()
        const {_id} = await params

        const findGroup = await Group.findById({_id}).populate("groupMembers.memId")

        if (!findGroup) {
            return NextResponse.json({
                success: false,
                message: "No group"
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: "Group is here",
            findGroup
        }, { status: 200 })
    } catch (error) {

        console.log(error.message)
        return NextResponse.json({
                success: false,
                message: error.message
            }, { status: 500 })
    }
}