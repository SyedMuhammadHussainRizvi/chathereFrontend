import { connect } from "@/lib/mongodb";
import Group from "@/models/Group"
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connect()

        const reqBody = await req.json()
        const { groupName, groupImage, groupDescription, groupMembers, lastMessage } = reqBody
        const memberIds = groupMembers.map(gm => gm.memId)

        const groupExistance = await Group.findOne({
            "groupMembers.memId": {
                $all: memberIds,
            },
            $expr: {
                $eq: [{ $size: "$groupMembers" }, memberIds.length],
            },
        });

        if (groupExistance) {
            return NextResponse.json({
                success: false,
                message: "You already have group with these members"
            }, { status: 400 })
        }

        const createGroup = new Group({
            groupName,
            groupImage,
            groupDescription,
            groupMembers,
            lastMessage
        })

        const newgroup = await createGroup.save()

        return NextResponse.json({
            success: true,
            message: "Your group has been created.",
            newgroup
        }, { status: 200 })

    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 400 })
    }
}