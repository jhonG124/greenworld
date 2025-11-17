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

router.get("/", authMiddleware, adminMiddleware, obtenerComentarios);
router.delete("/:id", authMiddleware, adminMiddleware, eliminarComentario);

export default router;
