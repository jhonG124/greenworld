// -------------------------
// 📌 IMPORTS
// -------------------------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// -------------------------
// 📌 CONFIGURACIONES
// -------------------------
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

// -------------------------
// 📌 CORS CONFIG — COMPATIBLE CON NETLIFY + RAILWAY
// -------------------------
const allowedOrigins = [
  "https://lovely-blancmange-094737.netlify.app", 
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite llamadas sin origen (ej: Postman, servidor interno)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS bloqueado: origen no permitido"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// -------------------------
// 📌 RUTAS API
// -------------------------
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

// -------------------------
// 📌 RUTA RAÍZ (TEST API)
// -------------------------
app.get("/", (req, res) => {
  res.send("API funcionando correctamente 🚀");
});

// -------------------------
// 📌 MANEJO GLOBAL DE ERRORES
// -------------------------
app.use((err, req, res, next) => {
  console.error("❌ ERROR GLOBAL:", err.message);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error interno del servidor",
  });
});

// -------------------------
// 📌 CONEXIÓN A MONGODB
// -------------------------
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
  })
  .then(() => console.log("✅ MongoDB conectado correctamente"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

// -------------------------
// 📌 PUERTO SERVIDOR (IMPORTANTE PARA RAILWAY)
// -------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor funcionando en puerto ${PORT}`);
});
