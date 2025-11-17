import React, { useEffect, useState } from "react";
import API_URL from "../config";

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
      const res = await fetch(`${API_URL}/api/users/${id}`);
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
      const res = await fetch(`${API_URL}/api/users/${usuario.id}`, {
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
    <div className="perfil-container">
      <h2>Mi Perfil</h2>

      {error && <p>{error}</p>}

      {modoEdicion ? (
        <div>
          <input
            type="text"
            value={perfil.nombre || ""}
            onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
          />
          <button onClick={guardarPerfil}>Guardar</button>
        </div>
      ) : (
        <div>
          <p><strong>Nombre:</strong> {perfil.nombre}</p>
          <p><strong>Correo:</strong> {perfil.correo}</p>

          <button onClick={() => setModoEdicion(true)}>Editar Perfil</button>
        </div>
      )}
    </div>
  );
}

export default Perfil;
