import { connect } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connect()

        const reqBody = await req.json()
        const { contactNumber, password } = reqBody

        const loginUser = await User.findOne({ contactNumber, password })

        if (!loginUser) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 400 })
        }


        return NextResponse.json({
            success: true,
            message: "Successfully logedin",
            loginUser
        }, { status: 200 })
    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}