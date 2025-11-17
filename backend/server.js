import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// =========================
// CONFIGURACIÓN CORS
// =========================
const allowedOrigin = process.env.CLIENT_URL || "*";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Conexión a MongoDB
connectDB();

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

// Puerto Render o local
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});
