import React, { useState } from "react";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [codigoOTP, setCodigoOTP] = useState("");
  const [mostrarOTP, setMostrarOTP] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tempUserId, setTempUserId] = useState(null); // Guarda ID temporal del usuario para OTP

  // Paso 1️⃣ - Iniciar sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      });

      const data = await res.json();

      if (res.ok && data.requireOTP) {
        // 🔒 Backend requiere verificación OTP
        setMostrarOTP(true);
        setTempUserId(data.userId);
        setMensaje("📩 Se ha enviado un código de verificación a tu correo");
      } else if (res.ok && data.token) {
        // ✅ Inicio de sesión sin OTP (caso admin u otros)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMensaje("✅ Inicio de sesión exitoso, redirigiendo...");
        setTimeout(() => (window.location.href = "/perfil"), 1200);
      } else {
        setMensaje(`⚠️ ${data.message || "Error al iniciar sesión"}`);
      }
    } catch (error) {
      console.error("❌ Error al conectar con el servidor:", error);
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  // Paso 2️⃣ - Verificar código OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: tempUserId, codigo: codigoOTP }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMensaje("✅ Verificación exitosa, redirigiendo...");
        setTimeout(() => (window.location.href = "/perfil"), 1200);
      } else {
        setMensaje(`⚠️ ${data.message || "Código incorrecto"}`);
      }
    } catch (error) {
      console.error("❌ Error al verificar OTP:", error);
      setMensaje("❌ Error al verificar OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
        Iniciar Sesión
      </h2>

      {!mostrarOTP ? (
        // 🔑 Formulario de login
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Iniciar Sesión
          </button>
        </form>
      ) : (
        // 🔒 Formulario de verificación OTP
        <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
          <p className="text-center text-gray-600 text-sm">
            Ingresa el código que recibiste por correo electrónico:
          </p>
          <input
            type="text"
            placeholder="Código de verificación"
            value={codigoOTP}
            onChange={(e) => setCodigoOTP(e.target.value)}
            className="border rounded p-2 text-center tracking-widest"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Verificar Código
          </button>
        </form>
      )}

      {mensaje && (
        <p className="text-center mt-4 text-sm font-medium text-gray-700">
          {mensaje}
        </p>
      )}
    </div>
  );
}

export default Login;
