import React, { useEffect, useState } from "react";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");

      // Validar que exista y que sea JSON válido
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
      console.error("Error al leer el usuario:", err);
      setError("Error al cargar la información del usuario.");
      localStorage.removeItem("user");
    }
  }, []);

  const obtenerPerfil = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`);
      if (!res.ok) throw new Error("No se pudo obtener el perfil");
      const data = await res.json();
      setPerfil(data);
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
      setError("No se pudo obtener la información del perfil.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil({ ...perfil, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPerfil({ ...perfil, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const guardarPerfil = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(perfil),
      });

      if (!res.ok) throw new Error("Error al guardar el perfil");
      const data = await res.json();
      setPerfil(data.user);
      setModoEdicion(false);
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      setError("No se pudo guardar el perfil.");
    }
  };

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">
        ⚠️ {error}
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="text-center mt-20 text-gray-700 font-semibold">
        Cargando información del usuario...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-8 rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        Perfil del Usuario
      </h2>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={
            perfil.avatar ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt="Avatar"
          className="w-28 h-28 rounded-full object-cover mb-3 shadow"
        />
        {modoEdicion && (
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="text-sm text-gray-600"
          />
        )}
      </div>

      {/* Info */}
      {modoEdicion ? (
        <>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={perfil.nombre || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={perfil.direccion || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <input
            type="number"
            name="edad"
            placeholder="Edad"
            value={perfil.edad || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={perfil.descripcion || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mb-2"
            rows="3"
          />
          <button
            onClick={guardarPerfil}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
          >
            Guardar cambios
          </button>
        </>
      ) : (
        <>
          <p><strong>Nombre:</strong> {perfil.nombre || "Sin definir"}</p>
          <p><strong>Correo:</strong> {perfil.correo || usuario.correo}</p>
          <p><strong>Dirección:</strong> {perfil.direccion || "Sin definir"}</p>
          <p><strong>Edad:</strong> {perfil.edad || "Sin definir"}</p>
          <p><strong>Descripción:</strong> {perfil.descripcion || "Sin descripción"}</p>

          <button
            onClick={() => setModoEdicion(true)}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
          >
            Editar perfil
          </button>
        </>
      )}

      <button
        className="mt-8 bg-red-500 text-white py-2 px-4 rounded w-full hover:bg-red-600"
        onClick={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default Perfil;
