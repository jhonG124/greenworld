import Comment from "../models/Comment.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ➕ Agregar comentario
export const addComment = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const newComment = new Comment({
      texto: req.body.texto,
      usuario: user._id,
    });

    await newComment.save();
    const commentWithUser = await newComment.populate("usuario", "nombre correo");

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error("❌ Error al agregar comentario:", error);
    res.status(500).json({ message: "Error al agregar comentario", error });
  }
};

// 📋 Obtener comentarios
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("usuario", "nombre correo")
      .sort({ fecha: -1 });
    res.json(comments);
  } catch (error) {
    console.error("❌ Error al obtener comentarios:", error);
    res.status(500).json({ message: "Error al obtener comentarios", error });
  }
};

// ❌ Eliminar comentario (solo admin)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });

    await comment.deleteOne();
    res.json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar comentario:", error);
    res.status(500).json({ message: "Error al eliminar comentario", error });
  }
};
