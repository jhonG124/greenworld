import express from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/userController.js";
import User from "../models/User.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-contraseña");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
});

// Obtener perfil por ID
router.get("/:id", getProfile);

// Actualizar perfil por ID
router.put("/:id", updateProfile);

// ❌ ELIMINAMOS rutas viejas que estaban causando el error:
// router.get("/", authMiddleware, adminMiddleware, obtenerUsuarios);
// router.delete("/:id", authMiddleware, adminMiddleware, eliminarUsuario);

export default router;
