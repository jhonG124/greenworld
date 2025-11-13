import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // ✅ Manejo completamente seguro
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Error al leer usuario del localStorage:", err);
    user = null;
  }

  const links = [
    { to: "/", label: "Inicio" },
    { to: "/educacion", label: "Educación" },
    { to: "/clasificacion", label: "Clasificación" },
    { to: "/comunidad", label: "Comunidad" },
  ];

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link
          to="/"
          className="text-2xl font-bold text-green-200 hover:text-white"
        >
          🌿 Green World
        </Link>

        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:text-green-300 transition ${
                location.pathname === link.to ? "font-semibold underline" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          {!user ? (
            <>
              <Link to="/login" className="hover:text-green-300 transition">
                Iniciar Sesión
              </Link>
              <Link to="/registro" className="hover:text-green-300 transition">
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <Link to="/perfil" className="hover:text-green-300 transition">
                Perfil
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
                className="hover:text-green-300 transition"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
