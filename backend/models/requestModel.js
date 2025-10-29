import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",      
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",      
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"], 
      default: "pending",                        
    },
  },
  { timestamps: true } 
);

export default mongoose.model("Request", requestSchema);
