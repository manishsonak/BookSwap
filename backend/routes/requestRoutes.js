import express from "express";
import {
  sendRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
} from "../controller/requestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendRequest);                
router.get("/sent", protect, getSentRequests);         
router.get("/received", protect, getReceivedRequests); 
router.patch("/:id", protect, updateRequestStatus);    

export default router;
