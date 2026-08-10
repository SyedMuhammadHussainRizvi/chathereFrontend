import { connect } from "@/lib/mongodb";
import Group from "@/models/Group";
import { NextResponse } from "next/server";
import messages from "@/models/messages";

export async function GET(req, { params }) {
    try {
        await connect()
        const {_id} = await params

        const findGroups = await Group.find({
            "groupMembers.memId": {
                $in: _id
            }
        }).populate("lastMessage")

        if (!findGroups) {
            return NextResponse.json({
                success: false,
                message: "No group"
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: "Groups are here",
            findGroups
        }, { status: 200 })
    } catch (error) {

        console.log(error.message)
        return NextResponse.json({
                success: false,
                message: error.message
            }, { status: 500 })
    }
}