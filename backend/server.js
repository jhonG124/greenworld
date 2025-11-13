import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // ⚠️ Ajusta si tu React corre en otro puerto
app.use(express.json());

// Conexión a MongoDB
connectDB();

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`));

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";
app.use(cors({ origin: allowedOrigin, credentials: true }));