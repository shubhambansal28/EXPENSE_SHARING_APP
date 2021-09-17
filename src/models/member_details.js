import mongoose from "mongoose";


const MemberDetailsSChema = new mongoose.Schema(
    {
        parentID: { type: String, trim: true },
        balances: [{ childId: String, refId: String, amount: Number }]
    },
    { timestamps: true, versionKey: false }
);


export default mongoose.model("MemberDetails", MemberDetailsSChema, "members");