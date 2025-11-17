import express from "express";
import { registerUser, loginUser, verifyOTP, getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.get("/:id", getProfile);
router.put("/:id", updateProfile);

export default router;
