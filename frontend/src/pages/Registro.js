import React, { useState } from "react";
import API_URL from "../config";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, contraseña }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ Registrado correctamente");
        setNombre("");
        setCorreo("");
        setContraseña("");
      } else {
        setMensaje(`⚠️ ${data.message}`);
      }
    } catch (err) {
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      { /* (resto igual) */ }
    </div>
  );
}

export default Registro;
