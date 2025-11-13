import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  direccion: { type: String, default: "" },
  edad: { type: Number, default: null },
  descripcion: { type: String, default: "" },
  avatar: { type: String, default: "" },
  rol: { type: String, enum: ["usuario", "admin"], default: "usuario" }, // 👈 nuevo campo
  codigo2FA: { type: String, default: null }, // 👈 código temporal
  codigo2FAExpira: { type: Date, default: null }, // 👈 expiración del código
});

export default mongoose.model("User", userSchema);
