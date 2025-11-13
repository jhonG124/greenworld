import React, { useState } from "react";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje("");

    // ✅ Validar formato de contraseña en frontend
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(contraseña)) {
      setMensaje(
        "⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial."
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, contraseña }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ Usuario registrado correctamente, ahora puedes iniciar sesión");
        setNombre("");
        setCorreo("");
        setContraseña("");
      } else {
        setMensaje(`⚠️ ${data.message || "Error al registrar"}`);
      }
    } catch (error) {
      console.error("❌ Error al conectar con el servidor:", error);
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
        Registro de Usuario
      </h2>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          className="border rounded p-2"
          required
        />
        <p className="text-xs text-gray-500 -mt-2">
          La contraseña debe tener al menos 8 caracteres, una mayúscula y un
          carácter especial.
        </p>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Registrarse
        </button>
      </form>

      {mensaje && <p className="text-center mt-4 text-sm">{mensaje}</p>}
    </div>
  );
}

export default Registro;
