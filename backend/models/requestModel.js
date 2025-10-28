import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",        // Ye link karta hai User collection se
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",        // Ye link karta hai Book collection se
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"], // Sirf ye 3 values allowed
      default: "pending",                         // Default status pending
    },
  },
  { timestamps: true } // createdAt aur updatedAt automatically add ho jayega
);

export default mongoose.model("Request", requestSchema);
