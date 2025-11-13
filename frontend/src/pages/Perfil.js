import React, { useEffect, useState } from "react";
import API from "../api";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");

      if (userData && userData !== "undefined" && userData !== "null") {
        const user = JSON.parse(userData);

        if (user && user.id) {
          setUsuario(user);
          obtenerPerfil(user.id);
        } else {
          setError("No se encontró información válida del usuario.");
        }
      } else {
        setError("No has iniciado sesión.");
      }
    } catch (err) {
      console.error("Error usuario:", err);
      setError("Error al cargar el usuario.");
      localStorage.removeItem("user");
    }
  }, []);

  const obtenerPerfil = async (id) => {
    try {
      const res = await fetch(`${API}/api/users/${id}`);
      if (!res.ok) throw new Error("No se pudo obtener el perfil");

      const data = await res.json();
      setPerfil(data);
    } catch (error) {
      console.error("Perfil error:", error);
      setError("No se pudo obtener el perfil.");
    }
  };

  const guardarPerfil = async () => {
    try {
      const res = await fetch(`${API}/api/users/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(perfil),
      });

      if (!res.ok) throw new Error("Error al guardar");
      const data = await res.json();
      setPerfil(data.user);
      setModoEdicion(false);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo guardar el perfil.");
    }
  };

  return (
    {/* ... RESTO IGUAL ... */}
  );
}

export default Perfil;
