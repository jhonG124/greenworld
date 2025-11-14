import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../api";

export default function Comunidad() {
  const [tips, setTips] = useState([]);
  const [nuevoTip, setNuevoTip] = useState("");

  // Leer usuario y token
  let usuario = null;
  let token = null;

  try {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      usuario = JSON.parse(storedUser);
    }
    if (storedToken && storedToken !== "undefined" && storedToken !== "null") {
      token = storedToken;
    }
  } catch (error) {
    console.error("Error localStorage:", error);
  }

  // Obtener comentarios
  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await axios.get(`${API}/api/comments`);
        if (Array.isArray(res.data)) {
          setTips(res.data);
        } else {
          console.error("❌ La API no devolvió un array:", res.data);
        }
      } catch (error) {
        console.error("❌ Error al obtener los tips:", error);
      }
    };

    fetchTips();
  }, []);

  // Agregar comentario
  const agregarTip = async () => {
    if (!usuario || !token) {
      alert("Debes iniciar sesión para agregar un comentario.");
      return;
    }
    if (!nuevoTip.trim()) return;

    try {
      const nuevo = { texto: nuevoTip };

      const res = await axios.post(`${API}/api/comments`, nuevo, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setTips([res.data, ...tips]);
      setNuevoTip("");
    } catch (error) {
      console.error("❌ Error al agregar comentario:", error);
      alert("Error al agregar comentario.");
    }
  };

  // Eliminar comentario
  const eliminarTip = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este comentario?"))
      return;

    try {
      await axios.delete(`${API}/api/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTips(tips.filter((tip) => tip._id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
      alert("No se pudo eliminar el comentario.");
    }
  };

  return (
    <div className="comunidad-container">
      <h2>Comunidad</h2>

      {usuario && (
        <div className="nuevo-tip-box">
          <textarea
            value={nuevoTip}
            onChange={(e) => setNuevoTip(e.target.value)}
            placeholder="Escribe un consejo o comentario..."
          ></textarea>

          <button onClick={agregarTip}>Agregar</button>
        </div>
      )}

      <div className="tips-list">
        {tips.map((tip) => (
          <div key={tip._id} className="tip">
            <p>{tip.texto}</p>

            {usuario && usuario.id === tip.userId && (
              <button onClick={() => eliminarTip(tip._id)}>Eliminar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
