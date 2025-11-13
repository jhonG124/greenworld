import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Comunidad() {
  const [tips, setTips] = useState([]);
  const [nuevoTip, setNuevoTip] = useState("");

  // ✅ Obtener usuario y token del localStorage
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
    console.error("Error al leer usuario/token del localStorage:", error);
  }

  // ✅ Cargar tips desde el backend
  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/comments");
        setTips(res.data);
      } catch (error) {
        console.error("❌ Error al obtener los tips:", error);
      }
    };
    fetchTips();
  }, []);

  // ✅ Agregar nuevo tip (envía token en Authorization)
  const agregarTip = async () => {
    if (!usuario || !token) {
      alert("Debes iniciar sesión para agregar un comentario.");
      return;
    }
    if (!nuevoTip.trim()) return;

    try {
      const nuevo = { texto: nuevoTip };

      const res = await axios.post(
        "http://localhost:5000/api/comments",
        nuevo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTips([res.data, ...tips]);
      setNuevoTip("");
    } catch (error) {
      console.error("❌ Error al agregar el tip:", error);
      alert("Ocurrió un error al agregar tu comentario. Revisa la consola.");
    }
  };

  // ❌ Eliminar comentario (solo admin)
  const eliminarTip = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este comentario?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTips(tips.filter((tip) => tip._id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar el comentario:", error);
      alert("No se pudo eliminar el comentario.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-200 p-8 text-gray-800">
      <h1 className="text-4xl font-bold text-green-700 text-center mb-8 flex items-center justify-center gap-2">
        🌎 Comunidad Green World
      </h1>

      {/* 🌿 RETOS SEMANALES */}
      <section className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mb-10">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
            alt="Logo retos"
            className="w-10 h-10"
          />
          <h2 className="text-3xl font-semibold text-green-700">
            🌿 Retos Semanales
          </h2>
        </div>

        <p className="text-gray-700 mb-6">
          ¡Participa en los retos ecológicos de esta semana y comparte videos
          mostrando cómo los llevaste a cabo!
        </p>

        <div className="space-y-10">
          {/* Ejemplos de retos */}
          {[
            {
              titulo: "♻️ Reto 1: Recicla al menos 10 botellas plásticas esta semana",
              desc: "Separa tus botellas y entrégalas en un punto de reciclaje.",
              video: "https://www.youtube.com/embed/gfJAlX13cPQ",
            },
            {
              titulo: "🚯 Reto 2: Evita plásticos de un solo uso por 7 días",
              desc: "Sustituye vasos, cubiertos y bolsas desechables por reutilizables.",
              video: "https://www.youtube.com/embed/T-V_8Ka9_78",
            },
            {
              titulo: "🌿 Reto 3: Planta un árbol o una planta en casa",
              desc: "Ayuda a reducir CO₂ con una nueva planta en tu hogar o comunidad.",
              video: "https://www.youtube.com/embed/bV-joQf8A6g",
            },
            {
              titulo: "💧 Reto 4: Ahorra agua en tus rutinas diarias",
              desc: "Cierra el grifo mientras te cepillas y reutiliza agua cuando sea posible.",
              video: "https://www.youtube.com/embed/NDrd1DNU_8M",
            },
            {
              titulo: "🛍️ Reto 5: Reutiliza bolsas o envases para tus compras",
              desc: "Lleva tu bolsa de tela o envase reutilizable al mercado.",
              video: "https://www.youtube.com/embed/tvmLv6Uv1ME",
            },
          ].map((reto, i) => (
            <div key={i} className="bg-green-50 p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-green-800">{reto.titulo}</h3>
              <p className="text-gray-700 mt-2">{reto.desc}</p>
              <div className="mt-4">
                <iframe
                  className="w-full h-60 rounded-lg"
                  src={reto.video}
                  title={`Video reto ${i + 1}`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 💬 Tips de la comunidad */}
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

                {/* Solo visible para admin */}
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
            Inicia sesión para participar en los tips de la comunidad 🌎
          </p>
        )}
      </section>
    </div>
  );
}
