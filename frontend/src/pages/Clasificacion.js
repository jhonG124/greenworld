import React, { useState, useEffect, useRef, useCallback } from "react";

export default function Clasificacion() {
  const residuos = [
    {
      tipo: "Orgánicos",
      ejemplos: "Restos de comida, cáscaras, hojas → Compostaje o contenedor verde",
      imagen:
        "https://media.istockphoto.com/id/1441779383/es/vector/contenedor-de-basura-con-desperdicios-de-comida-y-restos-de-comida-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=zdd9U6dh39HLDPRQ9pIF3be8vqFlYlsLcDG6ezLPWKY=",
    },
    {
      tipo: "Plástico",
      ejemplos: "Botellas, tapas, bolsas → Contenedor blanco",
      imagen:
        "https://img.freepik.com/vector-gratis/coleccion-ilustraciones-planas-residuos-plasticos-brillantes_74855-16764.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      tipo: "Papel y cartón",
      ejemplos: "Cajas, periódicos → Contenedor azul",
      imagen:
        "https://www.shutterstock.com/image-vector/paper-trash-icons-collection-vector-260nw-735599431.jpg",
    },
    {
      tipo: "Vidrio",
      ejemplos: "Frascos, botellas → Contenedor verde",
      imagen:
        "https://cdni.iconscout.com/illustration/premium/thumb/residuos-de-vidrio-illustration-svg-download-png-9271235.png",
    },
    {
      tipo: "Metales",
      ejemplos: "Latas, aerosoles vacíos → Contenedor gris",
      imagen:
        "https://www.shutterstock.com/image-vector/recycling-garbage-metal-elements-trash-260nw-631602341.jpg",
    },
    {
      tipo: "Peligrosos",
      ejemplos: "Pilas, medicamentos → Puntos de recolección especiales",
      imagen:
        "https://cdni.iconscout.com/illustration/premium/thumb/residuos-peligrosos-illustration-svg-download-png-9271236.png",
    },
  ];

  const recyclableImages = [
    "https://img.freepik.com/vector-premium/vector-cascara-platano-dibujos-animados_996692-2.jpg",
    "https://static.vecteezy.com/system/resources/previews/005/551/044/non_2x/water-plastic-bottle-cartoon-illustration-isolated-object-vector.jpg",
    "https://w7.pngwing.com/pngs/320/667/png-transparent-newspaper-journal-news-paper-magazine-newsletter-headlines-read-information-article.png",
  ];

  const nonRecyclableImages = [
    "https://w7.pngwing.com/pngs/506/786/png-transparent-hose-pipe-polyvinyl-chloride-plastic-spray-material-cable-material-medicine.png",
    "https://static.vecteezy.com/system/resources/previews/014/020/999/non_2x/videotape-cartoon-icon-vector.jpg",
    "https://www.shutterstock.com/image-vector/empty-red-sand-bucket-yellow-600nw-2462987017.jpg",
  ];

  const containerImg =
    "https://w7.pngwing.com/pngs/219/271/png-transparent-paper-recycling-bin-waste-container-cartoon-recycle-guy-recycling-waste-grass.png";

  const [trashItems, setTrashItems] = useState([]);
  const [playerX, setPlayerX] = useState(350);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameAreaRef = useRef(null);

  // Generar basura periódicamente
  const generateTrash = useCallback(() => {
    const isRecyclable = Math.random() > 0.4;
    const img = isRecyclable
      ? recyclableImages[Math.floor(Math.random() * recyclableImages.length)]
      : nonRecyclableImages[Math.floor(Math.random() * nonRecyclableImages.length)];
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * 700,
      y: 0,
      speed: 3 + Math.random() * 2,
      recyclable: isRecyclable,
      img,
    };
  }, []);

  useEffect(() => {
    if (!gameStarted) return;
    const interval = setInterval(() => {
      setTrashItems((prev) => [...prev, generateTrash()]);
    }, 1500); // cada 1.5s cae una nueva basura
    return () => clearInterval(interval);
  }, [gameStarted, generateTrash]);

  // Mover basura y detectar colisiones
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setTrashItems((prevTrash) =>
        prevTrash
          .map((trash) => ({ ...trash, y: trash.y + trash.speed }))
          .filter((trash) => trash.y < 400)
      );

      // Detectar colisión
      trashItems.forEach((trash) => {
        if (
          trash.y > 330 &&
          trash.y < 370 &&
          trash.x > playerX - 50 &&
          trash.x < playerX + 50
        ) {
          if (trash.recyclable) {
            setScore((s) => s + 1);
          } else {
            setGameOver(true);
          }
          setTrashItems((prev) => prev.filter((t) => t.id !== trash.id));
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, [trashItems, playerX, gameStarted, gameOver]);

  // Mover con flechas
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted || gameOver) return;
      if (e.key === "ArrowLeft") setPlayerX((x) => Math.max(0, x - 20));
      if (e.key === "ArrowRight") setPlayerX((x) => Math.min(700, x + 20));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setScore(0);
    setTrashItems([]);
    setGameOver(false);
    setGameStarted(true);
  };

  const resetGame = () => {
    setScore(0);
    setTrashItems([]);
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 p-8 text-gray-800">
      <h1 className="text-4xl font-bold text-green-800 text-center mb-8">
        🗑️ Clasificación de Residuos
      </h1>

      {/* Clasificación */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {residuos.map((item) => (
          <div
            key={item.tipo}
            className="bg-white p-6 rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            <img
              src={item.imagen}
              alt={item.tipo}
              className="w-full h-40 object-contain mb-4"
            />
            <h2 className="text-2xl font-semibold text-green-700 mb-3">
              {item.tipo}
            </h2>
            <p className="text-gray-700">{item.ejemplos}</p>
          </div>
        ))}
      </div>

      {/* Sección de infografía */}
      <div className="mt-12 text-center">
        {/* Juego */}
        <h3 className="text-xl font-semibold mt-8 mb-2">🎮 Juego: Recicla Rápido</h3>

        {!gameStarted && !gameOver && (
          <button
            onClick={startGame}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Iniciar Juego
          </button>
        )}

        {gameStarted && (
          <div
            ref={gameAreaRef}
            className="relative mx-auto mt-6 bg-white border border-gray-400 rounded-lg overflow-hidden"
            style={{ width: 800, height: 400 }}
          >
            {trashItems.map((trash) => (
              <img
                key={trash.id}
                src={trash.img}
                alt="trash"
                className="absolute w-10 h-10"
                style={{ top: trash.y, left: trash.x }}
              />
            ))}

            <img
              src={containerImg}
              alt="contenedor"
              className="absolute w-20 bottom-0"
              style={{ left: playerX }}
            />
          </div>
        )}

        {gameOver && (
          <div className="mt-4">
            <h4 className="text-red-600 font-bold text-lg">
              ❌ ¡Juego terminado! Atrápaste un residuo no reciclable.
            </h4>
            <button
              onClick={resetGame}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Reiniciar Juego
            </button>
          </div>
        )}

        {gameStarted && !gameOver && (
          <p className="mt-4 text-lg">Puntuación: {score}</p>
        )}
      </div>
    </div>
  );
}
