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

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

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
    <div className="registro-container">
      <h2>Registro de Usuario</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />

        <button type="submit">Registrarse</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Registro;
