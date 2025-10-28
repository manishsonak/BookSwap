import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import cookieParser from "cookie-parser";


dotenv.config();
connectDB();

const app = express();
import cors from "cors";

app.use(cors({
  origin: "https://book-swap-red.vercel.app", // FRONTEND URL
  credentials: true, // cookies / authentication
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

app.use("/api/requests", requestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
