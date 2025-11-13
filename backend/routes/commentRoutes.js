import express from "express";
import { addComment, getComments, deleteComment } from "../controllers/commentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todos pueden ver comentarios
router.get("/", getComments);

// Usuarios logueados pueden comentar
router.post("/", protect, addComment);

// Solo admin puede eliminar comentarios
router.delete("/:id", protect, adminOnly, deleteComment);

export default router;
