"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const MapaIRIS = dynamic(
  () => import("../components/MapaIRIS"),
  {
    ssr: false,
  }
);

type ResultadoIRIS = {
  mmsi: string | null;
  riesgo: string;
  score: number;
  señales: string[];
};

export default function Home() {
  const [escenario, setEscenario] = useState("normal");

  const [resultado, setResultado] =
    useState<ResultadoIRIS | null>(null);

  const [cargando, setCargando] = useState(false);

  const [error, setError] = useState("");

  async function analizarEscenario() {
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch(
        `http://127.0.0.1:8000/analizar/${escenario}`
      );

      if (!respuesta.ok) {
        throw new Error(
          "No se pudo analizar el escenario"
        );
      }

      const datos = await respuesta.json();

      setResultado(datos);
    } catch (error) {
      setError(
        "No se pudo conectar con la API de IRIS."
      );
    } finally {
      setCargando(false);
    }
  }

  const puntosIRIS = [
    {
      nombre: "Registro A",
      lat: -12.05,
      lng: -77.30,
    },
    {
      nombre: "Registro B",
      lat: -12.06,
      lng: -77.32,
    },
    {
      nombre: "Registro C",
      lat:
        escenario === "sospechoso"
          ? -12.50
          : -12.07,
      lng:
        escenario === "sospechoso"
          ? -78.50
          : -77.34,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-7xl mx-auto">

        {/* ========================================
            ENCABEZADO
        ======================================== */}

        <header className="mb-8">

          <h1 className="text-4xl font-bold">
            IRIS
          </h1>

          <p className="text-slate-400 mt-2">
            Maritime Intelligence &amp; Risk Identification System
          </p>

        </header>


        {/* ========================================
            SELECTOR
        ======================================== */}

        {/* ========================================
    SELECTOR
======================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">

          <div className="grid md:grid-cols-5 gap-6 items-center">

            {/* IMAGEN GUARDIÁN DEL MAR */}

            <div className="md:col-span-2 overflow-hidden rounded-xl border border-slate-800">

              <img
                src="/imagen_web.jpg"
                alt="Guardián del Mar"
                className="w-full aspect-video object-cover"
              />

            </div>


            {/* SELECTOR */}

            <div className="md:col-span-3">

              <label className="block text-sm text-slate-400 mb-2">
                Escenario
              </label>

              <select
                value={escenario}
                onChange={(e) => {
                  setEscenario(e.target.value);
                  setResultado(null);
                  setError("");
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
              >

                <option value="normal">
                  Normal
                </option>

                <option value="sospechoso">
                  Sospechoso
                </option>

              </select>


              <button
                onClick={analizarEscenario}
                disabled={cargando}
                className="w-full mt-4 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 px-6 py-3 rounded-xl font-semibold transition"
              >
                {cargando
                  ? "Analizando..."
                  : "Analizar"}
              </button>


              {error && (
                <p className="text-red-400 mt-4">
                  {error}
                </p>
              )}

            </div>

          </div>

        </section>


        {/* ========================================
            RESULTADO
        ======================================== */}

        {resultado && (
          <>

            {/* ====================================
                TARJETAS PRINCIPALES
            ==================================== */}

            <div className="grid md:grid-cols-3 gap-6 mb-6">


              {/* MMSI */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <p className="text-sm text-slate-400">
                  MMSI
                </p>

                <p className="text-2xl font-bold mt-2">
                  {resultado.mmsi}
                </p>

              </div>


              {/* RIESGO */}

              <div
                className={`rounded-2xl p-6 border ${
                  resultado.riesgo === "ALTO"
                    ? "bg-red-950/40 border-red-700"
                    : resultado.riesgo === "MEDIO"
                    ? "bg-yellow-950/40 border-yellow-700"
                    : "bg-green-950/40 border-green-700"
                }`}
              >

                <p className="text-sm text-slate-400">
                  Nivel de riesgo
                </p>


                <div className="flex items-center gap-3 mt-3">

                  <div
                    className={`w-4 h-4 rounded-full ${
                      resultado.riesgo === "ALTO"
                        ? "bg-red-500"
                        : resultado.riesgo === "MEDIO"
                        ? "bg-yellow-400"
                        : "bg-green-500"
                    }`}
                  />

                  <p
                    className={`text-3xl font-bold ${
                      resultado.riesgo === "ALTO"
                        ? "text-red-400"
                        : resultado.riesgo === "MEDIO"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {resultado.riesgo}
                  </p>

                </div>


                <p className="text-xs text-slate-500 mt-3">
                  Evaluación consolidada por IRIS
                </p>

              </div>


              {/* SCORE */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-400">
                    Score IRIS
                  </p>

                  <p className="text-2xl font-bold">

                    {resultado.score}

                    <span className="text-sm text-slate-500">
                      /100
                    </span>

                  </p>

                </div>


                <div className="mt-4 h-3 w-full bg-slate-800 rounded-full overflow-hidden">

                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      resultado.score >= 70
                        ? "bg-red-500"
                        : resultado.score >= 30
                        ? "bg-yellow-400"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${resultado.score}%`,
                    }}
                  />

                </div>


                <p className="text-xs text-slate-500 mt-2">
                  Nivel de riesgo calculado por IRIS
                </p>

              </div>

            </div>


            {/* ====================================
                MAPA
            ==================================== */}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">

              <div className="flex items-center justify-between mb-5">

                <div>

                  <h2 className="text-xl font-semibold">
                    Trayectoria de la embarcación
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Posiciones AIS analizadas por IRIS
                  </p>

                </div>

                {escenario === "sospechoso" && (
                  <span className="text-red-400 text-sm font-semibold">
                    Trayectoria anómala
                  </span>
                )}

              </div>

              <MapaIRIS puntos={puntosIRIS} />

            </section>


            {/* ====================================
                SEÑALES + INFORME
            ==================================== */}

            <div className="grid lg:grid-cols-2 gap-6">


              {/* SEÑALES */}

              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <h2 className="text-xl font-semibold mb-5">
                  Señales detectadas
                </h2>


                {resultado.señales.length > 0 ? (

                  <div className="space-y-3">

                    {resultado.señales.map(
                      (señal, indice) => (

                        <div
                          key={indice}
                          className="bg-slate-800 rounded-xl p-4 border border-slate-700"
                        >
                          <span className="text-red-400">
                            ⚠
                          </span>{" "}
                          {señal}
                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="bg-slate-800 rounded-xl p-4 text-slate-400">
                    No se detectaron señales relevantes.
                  </div>

                )}

              </section>


              {/* INFORME */}

              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <h2 className="text-xl font-semibold mb-5">
                  Informe para operador
                </h2>


                <p className="text-slate-300 leading-7">

                  {resultado.riesgo === "ALTO"
                    ? `La embarcación con MMSI ${resultado.mmsi} presenta un nivel de riesgo ALTO con un score de ${resultado.score}. Se detectaron las siguientes señales: ${resultado.señales.join(
                        ", "
                      )}. Se recomienda investigación por parte del operador.`
                    : resultado.riesgo === "MEDIO"
                    ? `La embarcación con MMSI ${resultado.mmsi} presenta un nivel de riesgo MEDIO con un score de ${resultado.score}. Se recomienda revisar las señales detectadas.`
                    : `La embarcación con MMSI ${resultado.mmsi} presenta un nivel de riesgo BAJO con un score de ${resultado.score}. No se detectaron señales relevantes.`}

                </p>

              </section>

            </div>

          </>
        )}

      </div>

    </main>
  );
}