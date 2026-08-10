import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
        req: true
    },

    message: {
        type: String,
        req: true,
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        req: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        req: true
    }

},
{
    timestamps: true,
})

export default mongoose.models.messages || mongoose.model("messages", messageSchema); 