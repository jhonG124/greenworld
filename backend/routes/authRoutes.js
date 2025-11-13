import express from "express";
import { registerUser } from "../controllers/userController.js";
import { loginUser, verifyOTP } from "../controllers/authController.js";

const router = express.Router();

// Registro de usuarios
router.post("/register", registerUser);

// Doble autenticación (2FA)
router.post("/login", loginUser); // Paso 1: correo + contraseña
router.post("/verify-otp", verifyOTP); // Paso 2: verificar el código OTP

export default router;
