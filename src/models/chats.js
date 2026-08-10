import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    chatMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true

    }],

    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages",
    },

},
    {
        timestamps: true,
    }
)

export default mongoose.models.chats || mongoose.model("chats", ChatSchema); 