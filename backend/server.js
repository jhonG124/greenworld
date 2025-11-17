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
// CORS FIX para Railway
// =========================

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        "https://greenworld-frontend-beryl.vercel.app",
        "https://greenworld.vercel.app",
        "https://greenworld-sigma.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
      ];

      if (!origin || allowed.includes(origin) || origin.includes("railway.app")) {
        callback(null, true);
      } else {
        callback(new Error("CORS bloqueado por servidor"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

connectDB();

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`)
);
