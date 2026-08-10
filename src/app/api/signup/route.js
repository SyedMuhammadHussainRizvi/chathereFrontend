import { connect } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connect()

        const reqBody = await req.json()
        const { name, contactNumber, password, status } = reqBody

        const alreadyUser = await User.findOne({ contactNumber })
        if (alreadyUser) {
            return NextResponse.json({
                success: false,
                message: "This contact number is already registered"
            }, { status: 300 })
        }

        const newUser = new User({
            name,
            contactNumber,
            password,
            status
        })

        if (!newUser) {
            return NextResponse.json({
                success: false,
                message: "Can't add this time"
            }, { status: 300 })
        }

        const newUsersaved = await newUser.save()

        return NextResponse.json({
            success: true,
            message: "You are registered now",
            newUsersaved
        }, { status: 200 })
    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}