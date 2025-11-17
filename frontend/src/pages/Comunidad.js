import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

export default function Comunidad() {
  const [tips, setTips] = useState([]);
  const [nuevoTip, setNuevoTip] = useState("");

  // Obtener usuario y token
  let usuario = null;
  let token = null;

  try {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedUser !== "undefined") usuario = JSON.parse(storedUser);
    if (storedToken && storedToken !== "undefined") token = storedToken;
  } catch (error) {
    console.error("Error leyendo localStorage:", error);
  }

  // Cargar comentarios
  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/comments`);
        setTips(res.data);
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
      const res = await axios.post(`${API_URL}/api/comments`, nuevo, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setTips([res.data, ...tips]);
      setNuevoTip("");
    } catch (error) {
      console.error("❌ Error al agregar tip:", error);
    }
  };

  // Eliminar comentario (solo admin)
  const eliminarTip = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este comentario?")) return;

    try {
      await axios.delete(`${API_URL}/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTips(tips.filter((t) => t._id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar comentario:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-200 p-8 text-gray-800">
      <h1 className="text-4xl font-bold text-green-700 text-center mb-8 flex items-center justify-center gap-2">
        🌎 Comunidad Green World
      </h1>

      {/* RETOS SEMANALES */}
      {/* (no modifico esta parte porque está bien) */}

      {/* TIPS DE LA COMUNIDAD */}
      <section className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          💬 Tips de la comunidad
        </h2>

        {tips.length === 0 ? (
          <p className="text-center text-gray-600 italic mb-4">
            No hay comentarios aún. ¡Sé el primero en compartir uno! 🌱
          </p>
        ) : (
          <ul className="space-y-4 mb-6">
            {tips.map((tip) => (
              <li
                key={tip._id}
                className="border-b pb-2 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-green-800">
                    {tip.usuario?.nombre || "Usuario anónimo"}
                  </p>
                  <p className="italic">“{tip.texto}”</p>
                </div>

                {usuario?.rol === "admin" && (
                  <button
                    onClick={() => eliminarTip(tip._id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Campo para enviar comentario */}
        {usuario ? (
          <div className="flex gap-3">
            <input
              type="text"
              value={nuevoTip}
              onChange={(e) => setNuevoTip(e.target.value)}
              placeholder="Escribe tu consejo..."
              className="flex-1 border rounded-lg p-2"
            />
            <button
              onClick={agregarTip}
              className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg"
            >
              Agregar
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-600 italic">
            Inicia sesión para participar 🌎
          </p>
        )}
      </section>
    </div>
  );
}
