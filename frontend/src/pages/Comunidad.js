import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../api";

export default function Comunidad() {
  const [tips, setTips] = useState([]);
  const [nuevoTip, setNuevoTip] = useState("");

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

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await axios.get(`${API}/api/comments`);
        setTips(res.data);
      } catch (error) {
        console.error("❌ Error al obtener los tips:", error);
      }
    };
    fetchTips();
  }, []);

  const agregarTip = async () => {
    if (!usuario || !token) {
      alert("Debes iniciar sesión para agregar un comentario.");
      return;
    }
    if (!nuevoTip.trim()) return;

    try {
      const nuevo = { texto: nuevoTip };

      const res = await axios.post(
        `${API}/api/comments`,
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

  const eliminarTip = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este comentario?")) return;

    try {
      await axios.delete(`${API}/api/comments/${id}`, {
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
    {/* ... RESTO IGUAL ... */}
  );
}
