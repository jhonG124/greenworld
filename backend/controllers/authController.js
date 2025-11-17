import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import speakeasy from "speakeasy";

// LOGIN
export const loginUser = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const esValida = await bcrypt.compare(contraseña, user.contraseña);
    if (!esValida) return res.status(400).json({ message: "Contraseña incorrecta" });

    const codigo = speakeasy.totp({
      secret: process.env.OTP_SECRET || "supersecreto",
      digits: 6,
      step: 300,
    });

    user.codigo2FA = codigo;
    user.codigo2FAExpira = Date.now() + 5 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Green World" <${process.env.EMAIL_USER}>`,
      to: user.correo,
      subject: "Código de verificación",
      text: `Tu código es: ${codigo}`,
    });

    res.json({
      message: "Código enviado al correo",
      userId: user._id,
    });

  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// VERIFICAR OTP
export const verifyOTP = async (req, res) => {
  const { userId, codigo } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (!user.codigo2FA || user.codigo2FA !== codigo || Date.now() > user.codigo2FAExpira) {
      return res.status(400).json({ message: "Código inválido o expirado" });
    }

    user.codigo2FA = null;
    user.codigo2FAExpira = null;
    await user.save();

    const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
