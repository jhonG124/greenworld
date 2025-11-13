import express from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/userController.js";
import User from "../models/User.js";

const router = express.Router();

// Obtener todos los usuarios (opcional)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-contraseña");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
});

// Rutas de perfil
router.get("/:id", getProfile);
router.put("/:id", updateProfile);

export default router;
