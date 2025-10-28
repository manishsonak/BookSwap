import express from "express";
import { loginUser, logoutUser, registerUser, updateUser } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get('/logout',logoutUser)
router.put("/update", protect, updateUser);

export default router;
