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
// CORS FIX — versión estable
// =========================
const allowedOrigins = [
  "https://greenworld-frontend-beryl.vercel.app",
  "https://greenworld.vercel.app",
  "https://greenworld-sigma.vercel.app",
  "https://greenworld-git-main-jhons-projects-26dc5405.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
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

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});
