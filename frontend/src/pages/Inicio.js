import React from "react";
import { useNavigate } from "react-router-dom";

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 flex flex-col items-center text-center p-8">
      <h1 className="text-4xl font-bold text-green-800 mb-6">
        🌎 Bienvenido a <span className="text-green-600">Green World</span>
      </h1>

      <p className="text-lg text-gray-700 max-w-3xl mb-8">
        “Transforma tus hábitos, transforma el planeta. Green World te enseña
        cómo reciclar desde casa y convertirte en un agente del cambio.”
      </p>

      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl mb-8">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          ♻️ Datos Curiosos
        </h2>
        <ul className="text-gray-600 space-y-3">
          <li>
            🌍 Cada año se generan más de <b>2 mil millones</b> de toneladas de
            residuos en el mundo.
          </li>
          <li>
            ⚡ Reciclar una sola lata de aluminio ahorra la energía suficiente
            para encender una televisión durante <b>3 horas</b>.
          </li>
        </ul>
      </div>

      <div className="bg-green-700 text-white p-6 rounded-2xl shadow-xl max-w-2xl mb-8">
        <h3 className="text-2xl font-bold mb-2">¿Por qué reciclar?</h3>
        <p className="text-gray-100">
          Reciclar reduce la contaminación, ahorra energía y protege los recursos
          naturales. Además, impulsa la economía circular y genera empleos verdes.
        </p>
      </div>

      <button
        onClick={() => navigate("/educacion")}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md"
      >
        🌱 Comienza tu aprendizaje →
      </button>

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-green-800 mb-4">
          🌿 Ciclo del Reciclaje
        </h3>
        <img src="https://img.freepik.com/vector-premium/pasos-proceso-reciclaje-basura_29937-3273.jpg" alt="Reciclaje" className="w-full rounded-lg shadow-md" />
      </div>
    </div>
  );
}
