import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const otpStore = {}; // Guardará temporalmente los OTP generados

// Configuración del correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🟢 LOGIN: Verifica usuario + contraseña y envía código de verificación
export const loginUser = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const esValida = await bcrypt.compare(contraseña, user.contraseña);
    if (!esValida) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar un código de 6 dígitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[user._id] = otp;

    // Guardar en BD por seguridad (opcional)
    user.codigo2FA = otp;
    user.codigo2FAExpira = Date.now() + 5 * 60 * 1000; // 5 minutos
    await user.save();

    // Enviar el correo
    await transporter.sendMail({
      from: `"Green World 🌎" <${process.env.EMAIL_USER}>`,
      to: user.correo,
      subject: "Código de verificación (Green World)",
      html: `
        <h3>Hola, ${user.nombre}</h3>
        <p>Tu código de verificación es:</p>
        <h2>${otp}</h2>
        <p>Este código expira en 5 minutos.</p>
      `,
    });

    console.log(`📨 Código OTP enviado a ${user.correo}: ${otp}`);

    return res.json({
      requireOTP: true,
      userId: user._id,
      message: "Se ha enviado un código de verificación a tu correo electrónico",
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🟢 VERIFICAR CÓDIGO OTP
export const verifyOTP = async (req, res) => {
  const { userId, codigo } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Validar código y expiración
    if (
      !user.codigo2FA ||
      user.codigo2FA !== codigo ||
      Date.now() > user.codigo2FAExpira
    ) {
      return res.status(400).json({ message: "Código inválido o expirado" });
    }

    // Limpiar el código de la BD
    user.codigo2FA = null;
    user.codigo2FAExpira = null;
    await user.save();

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Error al verificar OTP:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
