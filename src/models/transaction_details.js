import mongoose from "mongoose";


const TransactionDetailsSChema = new mongoose.Schema(
    {
        refUserId: { type: String, trim: true },
        billAmount: { type: Number, trim: true },
        remarks: { type: String, lowercase: true }
    },
    { timestamps: true, versionKey: false }
);


export default mongoose.model("TransactionDetails", TransactionDetailsSChema, "transactions");