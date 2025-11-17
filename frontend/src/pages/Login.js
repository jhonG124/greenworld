import React, { useState } from "react";
import API_URL from "../config";

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
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      });

      const data = await res.json();

      if (res.ok && data.requireOTP) {
        setMostrarOTP(true);
        setTempUserId(data.userId);
        setMensaje("📩 Código enviado al correo");
      } else if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMensaje("✅ Inicio de sesión exitoso");
        setTimeout(() => (window.location.href = "/perfil"), 1200);
      } else {
        setMensaje(`⚠️ ${data.message}`);
      }
    } catch (err) {
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: tempUserId, codigo: codigoOTP }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMensaje("✅ Verificado correctamente");
        setTimeout(() => (window.location.href = "/perfil"), 1200);
      } else {
        setMensaje(`⚠️ ${data.message}`);
      }
    } catch (err) {
      setMensaje("❌ Error verificando OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      {/* FORMULARIOS */}
      { /* (continúa igual) */ }
    </div>
  );
}

export default Login;
