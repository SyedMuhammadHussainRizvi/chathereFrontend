import mongoose, { model } from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },

    contactNumber: {
        type: Number,
        required: [true, "Number is required"],
        unique: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 3,
    },
    status:{
        type: String,
        enum: ["offline", "online"],
        default: "offline"
    }
},
{
    timestamps: true,
}
)

export default mongoose.models.users || mongoose.model("users", UserSchema); 