import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =============================
// 🔐 PROTEGER RUTAS (TOKEN JWT)
// =============================
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-contraseña");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error en protect middleware:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// =============================
// 👑 SOLO ADMINISTRADORES
// =============================
export const adminOnly = (req, res, next) => {
  if (req.user?.rol === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Acceso denegado: solo administradores" });
};
