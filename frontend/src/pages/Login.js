import React, { useState } from "react";
import API from "../api";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [codigoOTP, setCodigoOTP] = useState("");
  const [mostrarOTP, setMostrarOTP] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tempUserId, setTempUserId] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      });

      const data = await res.json();

      if (res.ok && data.requireOTP) {
        setMostrarOTP(true);
        setTempUserId(data.userId);
        setMensaje("📩 Se ha enviado un código de verificación a tu correo");
      } else if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMensaje("✅ Inicio de sesión exitoso...");
        setTimeout(() => (window.location.href = "/perfil"), 1200);
      } else {
        setMensaje(`⚠️ ${data.message || "Error al iniciar sesión"}`);
      }
    } catch (error) {
      console.error("❌ Error al conectar:", error);
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: tempUserId, codigo: codigoOTP }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMensaje("✅ Verificación exitosa...");
        setTimeout(() => (window.location.href = "/perfil"), 1200);
      } else {
        setMensaje(`⚠️ ${data.message || "Código incorrecto"}`);
      }
    } catch (error) {
      console.error("❌ Error al verificar:", error);
      setMensaje("❌ Error al verificar OTP");
    }
  };

  return (
    <div className="login-container">
      <h2>Inicio de Sesión</h2>

      {!mostrarOTP ? (
        <form onSubmit={handleLogin}>
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
          <button type="submit">Iniciar Sesión</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <input
            type="text"
            placeholder="Código OTP"
            value={codigoOTP}
            onChange={(e) => setCodigoOTP(e.target.value)}
            required
          />
          <button type="submit">Verificar Código</button>
        </form>
      )}

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Login;
