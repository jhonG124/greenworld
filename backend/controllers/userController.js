import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import speakeasy from "speakeasy";

// ========================
// REGISTRO DE USUARIO
// ========================
export const registerUser = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    // ✅ Validar formato de contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(contraseña)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.",
      });
    }

    const existeUsuario = await User.findOne({ correo });
    if (existeUsuario) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const rol = correo === "jhon@gmail.com" ? "admin" : "usuario";

    const nuevoUsuario = new User({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol,
    });
    await nuevoUsuario.save();

    res.status(201).json({
      message: `Usuario registrado exitosamente como ${rol}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar usuario",
      error,
    });
  }
};

// ========================
// INICIO DE SESIÓN (PASO 1)
// ========================
export const loginUser = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const esValida = await bcrypt.compare(contraseña, user.contraseña);
    if (!esValida) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar código de verificación temporal (OTP)
    const token2FA = speakeasy.totp({
      secret: process.env.OTP_SECRET || "supersecreto",
      digits: 6,
      step: 300, // válido 5 minutos
    });

    user.codigo2FA = token2FA;
    user.codigo2FAExpira = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Configurar envío de correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"App Control de Gastos" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Tu código de verificación (2FA)",
      text: `Hola ${user.nombre}, tu código de verificación es: ${token2FA}. Este código expira en 5 minutos.`,
    });

    res.json({ message: "Código de verificación enviado al correo", correo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al enviar código de verificación", error });
  }
};

// ========================
// VERIFICAR CÓDIGO 2FA (PASO 2)
// ========================
export const verifyOTP = async (req, res) => {
  const { correo, codigo } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (
      user.codigo2FA !== codigo ||
      !user.codigo2FAExpira ||
      user.codigo2FAExpira < Date.now()
    ) {
      return res.status(400).json({ message: "Código inválido o expirado" });
    }

    user.codigo2FA = null;
    user.codigo2FAExpira = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Autenticación completada exitosamente",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        direccion: user.direccion,
        edad: user.edad,
        descripcion: user.descripcion,
        avatar: user.avatar,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al verificar código", error });
  }
};

// ========================
// PERFIL DE USUARIO
// ========================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-contraseña");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error });
  }
};

// ========================
// ACTUALIZAR PERFIL
// ========================
export const updateProfile = async (req, res) => {
  const { nombre, direccion, edad, descripcion, avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, direccion, edad, descripcion, avatar },
      { new: true }
    ).select("-contraseña");

    res.json({ message: "Perfil actualizado correctamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar perfil", error });
  }
};
