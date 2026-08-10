import mongoose from "mongoose";

export async function connect(){
    try {
        if(mongoose.connection.readyState === 1){
            return
        }

        await mongoose.connect(process.env.MONGODB_URI)

        console.log("DB connected");

    } catch (error) {
        console.log("DB connection error:", error);
        throw error;
    }
}