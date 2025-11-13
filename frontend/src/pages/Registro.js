import React, { useState } from "react";
import API from "../api";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje("");

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(contraseña)) {
      setMensaje(
        "⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial."
      );
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, contraseña }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ Usuario registrado correctamente");
        setNombre("");
        setCorreo("");
        setContraseña("");
      } else {
        setMensaje(`⚠️ ${data.message || "Error al registrar"}`);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  return (
    {/* ... RESTO IGUAL ... */}
  );
}

export default Registro;
