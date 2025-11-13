import React, { useState } from "react";

export default function Educacion() {
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAnswerClick = (questionIndex, isCorrect) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: isCorrect,
    }));
  };

  const calcularPuntaje = () => {
    let total = 0;
    preguntas.forEach((item, index) => {
      if (selectedAnswers[index] === item.correcta) total++;
    });
    setScore(total);
  };

  const temas = [
    {
      pregunta: "¿Qué es el reciclaje y por qué es importante?",
      respuesta:
        "El reciclaje es el proceso de convertir residuos en nuevos productos o materia prima para su reutilización, reduciendo la extracción de nuevos recursos. Es importante porque disminuye la contaminación, protege el medio ambiente, fomenta la economía circular y genera empleo.",
    },
    {
      pregunta: "Los tipos de residuos y su tratamiento.",
      respuesta:
        "Los residuos pueden ser orgánicos, inorgánicos, peligrosos y reciclables. Cada tipo requiere un tratamiento diferente, como compostaje, reutilización o eliminación segura.",
    },
    {
      pregunta: "Cómo reducir, reutilizar y reciclar en casa.",
      respuesta:
        "Puedes reducir evitando productos desechables, reutilizando envases o bolsas, y reciclando correctamente separando papel, plástico, vidrio y metales.",
    },
    {
      pregunta: "Impacto del reciclaje en la economía circular.",
      respuesta:
        "El reciclaje impulsa la economía circular al mantener los recursos en uso el mayor tiempo posible, creando empleo y reduciendo la dependencia de materias primas nuevas.",
    },
  ];

  const preguntas = [
    {
      pregunta: "El reciclaje ayuda a reducir la contaminación ambiental.",
      correcta: true,
    },
    {
      pregunta: "Los residuos orgánicos no pueden reciclarse.",
      correcta: false,
    },
    {
      pregunta: "Reutilizar envases es una forma de reducir desechos.",
      correcta: true,
    },
    {
      pregunta: "El reciclaje aumenta el uso de materias primas nuevas.",
      correcta: false,
    },
    {
      pregunta: "La economía circular busca aprovechar los recursos al máximo.",
      correcta: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-200 p-8 text-gray-800">
      <h1 className="text-4xl font-bold text-green-700 text-center mb-8">
        📘 Educación y Aprendizaje
      </h1>

      {/* Temas principales */}
      <section className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Temas principales</h2>
        <div className="space-y-3">
          {temas.map((item, index) => (
            <div
              key={index}
              className="border border-green-300 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleAnswer(index)}
                className="w-full text-left px-4 py-3 bg-green-100 hover:bg-green-200 transition-colors duration-200 font-medium flex justify-between items-center"
              >
                {item.pregunta}
                <span>{openIndex === index ? "▲" : "▼"}</span>
              </button>
              {openIndex === index && (
                <p className="p-4 bg-white border-t border-green-300">
                  {item.respuesta}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Artículos o guías */}
      <section className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Artículos o guías</h2>
        <ul className="space-y-6">
          <li>
            🪱 “Cómo hacer compost en casa.”
            <iframe
              className="mt-2 rounded-xl"
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/cIOkj7sMrPo"
              title="Cómo hacer compost en casa"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </li>
          <li>
            ♻️ “Ideas para reutilizar botellas plásticas.”
            <iframe
              className="mt-2 rounded-xl"
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/FwEGLu3ssiU"
              title="Ideas para reutilizar botellas plásticas"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </li>
          <li>
            🚯 “Errores comunes al reciclar.”
            <iframe
              className="mt-2 rounded-xl"
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/z9F4ozxdHN0"
              title="Errores comunes al reciclar"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </li>
        </ul>
      </section>

      {/* Cuestionarios o Trivias */}
      <section className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mt-8 mb-4">
          🧠 Cuestionarios o Trivias
        </h2>
        <div className="space-y-4">
          {preguntas.map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <p className="font-medium mb-3">{item.pregunta}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleAnswerClick(index, true)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedAnswers[index] === true
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 hover:bg-green-100"
                  }`}
                >
                  Verdadero
                </button>
                <button
                  onClick={() => handleAnswerClick(index, false)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedAnswers[index] === false
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 hover:bg-red-100"
                  }`}
                >
                  Falso
                </button>
              </div>
              {selectedAnswers[index] !== undefined && (
                <p
                  className={`mt-3 font-semibold ${
                    selectedAnswers[index] === item.correcta
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedAnswers[index] === item.correcta
                    ? "✅ ¡Respuesta correcta!"
                    : "❌ Respuesta incorrecta."}
                </p>
              )}
            </div>
          ))}

          {/* Botón para calcular puntaje */}
          <div className="text-center mt-6">
            <button
              onClick={calcularPuntaje}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Ver puntaje
            </button>

            {score !== null && (
              <p className="mt-4 text-lg font-bold text-green-700">
                🏆 Tu puntuación: {score} de {preguntas.length}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
