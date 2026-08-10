import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        trim: true,
    },

    groupImage: {
        type: String,
        default: "/images/profile.png",
    },

    groupDescription: {
        type: String,
        default: "",
    },

    groupMembers: {
        type: [
            {
                memId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "users",
                    required: true,
                },
                memStatus: {
                    type: String,
                    enum: ["creator", "admin", "user"],
                    default: "user",
                    required: true,
                },
            },
        ],
        validate: {
            validator: function (value) {
                return value.length >= 3;
            },
            message: "A group must have at least 3 members.",
        },
    },


    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages",
    },





},
    {
        timestamps: true,
    }
)

export default mongoose.models.groups || mongoose.model("groups", GroupSchema); 