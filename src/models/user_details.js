import mongoose from "mongoose";


const UserDetailsSChema = new mongoose.Schema(
    {
        userName: { type: String, trim: true },
        contact: { type: String, trim: true },
        gender: { type: String, lowercase: true },
        age: { type: String, trim: true }
    },
    { timestamps: true, versionKey: false }
);


export default mongoose.model("UserDetails", UserDetailsSChema, "users");