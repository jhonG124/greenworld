import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ------------------------
// REGISTRO DE USUARIO
// ------------------------
export const registerUser = async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;

    // Verificar si el correo ya está registrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Crear usuario
    const newUser = new User({
      nombre,
      email,
      contraseña: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser._id,
        nombre: newUser.nombre,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// ------------------------
// OBTENER PERFIL
// ------------------------
export const getProfile = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id)
      return res.status(403).json({ message: "No puedes ver otro perfil" });

    const user = await User.findById(req.params.id).select("-contraseña");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};

// ------------------------
// ACTUALIZAR PERFIL
// ------------------------
export const updateProfile = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id)
      return res.status(403).json({ message: "No puedes editar otro perfil" });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-contraseña");

    res.json({ message: "Perfil actualizado", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
};
