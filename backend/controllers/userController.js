import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ========================
// REGISTRO DE USUARIO
// ========================
export const registerUser = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const existe = await User.findOne({ correo });
    if (existe)
      return res.status(400).json({ message: "El correo ya está registrado" });

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
      message: `Usuario registrado correctamente (${rol})`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// ========================
// PERFIL
// ========================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-contraseña");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil" });
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

    res.json({ message: "Perfil actualizado", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
};
