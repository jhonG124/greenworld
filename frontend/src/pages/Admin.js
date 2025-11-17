import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    obtenerUsuarios();
    obtenerComentarios();
  }, []);

  const obtenerUsuarios = async () => {
    const res = await axios.get(`${API_URL}/api/users`);
    setUsuarios(res.data);
  };

  const obtenerComentarios = async () => {
    const res = await axios.get(`${API_URL}/api/comments`);
    setComentarios(res.data);
  };

  const eliminarUsuario = async (id) => {
    await axios.delete(`${API_URL}/api/users/${id}`);
    obtenerUsuarios();
  };

  const eliminarComentario = async (id) => {
    await axios.delete(`${API_URL}/api/comments/${id}`);
    obtenerComentarios();
  };

  return (
    <div className="p-6">
      {/* (resto igual) */}
    </div>
  );
};

export default Admin;
