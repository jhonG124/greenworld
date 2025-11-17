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
const allowedOrigins = [
  "*", // Permitir todo temporalmente (Render no siempre acepta "*", pero lo probamos)
  "https://greenworld.vercel.app",
  "https://greenworld-sigma.vercel.app",
  "https://greenwold-frontend-r1wwdhdks-jhons-projects-26dc5405.vercel.app",
  "https://greenworld-git-main-jhons-projects-26dc5405.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, apps internas
      if (allowedOrigins.includes("*")) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("❌ CORS bloqueado para:", origin);
      return callback(new Error("No permitido por CORS"));
    },
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
