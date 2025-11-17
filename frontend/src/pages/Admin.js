import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    obtenerUsuarios();
    obtenerComentarios();
  }, []);

  const obtenerUsuarios = async () => {
    const res = await axios.get("http://localhost:4000/api/users");
    setUsuarios(res.data);
  };

  const obtenerComentarios = async () => {
    const res = await axios.get("http://localhost:4000/api/comments");
    setComentarios(res.data);
  };

  const eliminarUsuario = async (id) => {
    await axios.delete(`http://localhost:4000/api/users/${id}`);
    obtenerUsuarios();
  };

  const eliminarComentario = async (id) => {
    await axios.delete(`http://localhost:4000/api/comments/${id}`);
    obtenerComentarios();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>

      {/* Usuarios */}
      <h2 className="text-2xl font-semibold mt-4">Usuarios</h2>
      <ul>
        {usuarios.map(u => (
          <li key={u._id} className="flex justify-between border p-2 my-2">
            {u.email}
            <button
              onClick={() => eliminarUsuario(u._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* Comentarios */}
      <h2 className="text-2xl font-semibold mt-10">Comentarios</h2>
      <ul>
        {comentarios.map(c => (
          <li key={c._id} className="flex justify-between border p-2 my-2">
            {c.texto}
            <button
              onClick={() => eliminarComentario(c._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
