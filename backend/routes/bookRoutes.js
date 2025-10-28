import express from "express";
import {
  addBook,
  getAllBooks,
  getMyBooks,
  deleteBook,
} from "../controller/bookController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addBook);         
router.get("/", protect, getAllBooks);      
router.get("/my", protect, getMyBooks);     
router.delete("/:id", protect, deleteBook); 

export default router;
