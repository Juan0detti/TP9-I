import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ComprarPasajes() {
  // Obtiene el 'vueloId' de la URL (gracias a react-router-dom)
  const { vueloId } = useParams();
  const navigate = useNavigate();

  const [vueloInfo, setVueloInfo] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPasajeId, setSelectedPasajeId] = useState(null);

  // Aseguramos que el usuario esté logueado
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Debes iniciar sesión para comprar pasajes.");
      navigate("/login"); // O la ruta de tu página de login
      return;
    }
    fetchDisponibilidad();
  }, [vueloId, token, navigate]);

  const fetchDisponibilidad = async () => {
    setLoading(true);
    setError(null);
    try {
      // Usamos la función getAvailablePasajes que revisamos antes
      const res = await fetch(
        `http://localhost:3000/api/v1/pasajes/${vueloId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo obtener la disponibilidad.");
      }

      setVueloInfo(data.vuelo);
      setDisponibilidad(data.disponibilidad);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComprar = async () => {
    if (!selectedPasajeId) {
      alert("Por favor, selecciona un asiento antes de comprar.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/v1/pasajes/comprar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pasajeId: selectedPasajeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Error en la compra: ${data.error}`);
      } else {
        alert(data.message);
        // Recargar la disponibilidad para reflejar el asiento vendido
        fetchDisponibilidad();
        setSelectedPasajeId(null);
        // Opcional: navegar a la página de mis vuelos
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Error de red al procesar la compra.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xl">
        Cargando disponibilidad del vuelo... ✈️
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  if (!vueloInfo) {
    return (
      <div className="p-8 text-center text-gray-500">
        Vuelo no encontrado o ID inválido.
      </div>
    );
  }

  const clases = Object.keys(disponibilidad);

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-sky-700">
        Comprar Pasaje: Vuelo {vueloInfo.id}
      </h1>

      <div className="bg-sky-100 p-4 rounded-md mb-6 border-l-4 border-sky-500">
        <p className="font-semibold text-lg">
          {vueloInfo.origen} → {vueloInfo.destino}
        </p>
        <p className="text-sm">
          Salida: {new Date(vueloInfo.fecha_salida).toLocaleString()} | Precio
          Base: <span className="font-bold">${vueloInfo.precio}</span>
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Selecciona tu Asiento:</h2>

      {clases.length === 0 ? (
        <p className="text-red-500 font-semibold">
          🚫 ¡Asientos agotados para este vuelo!
        </p>
      ) : (
        <div className="space-y-6">
          {clases.map((clase) => (
            <div
              key={clase}
              className="border p-4 rounded-lg bg-white shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-3 capitalize text-gray-800">
                Clase {clase}
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {disponibilidad[clase].map((pasaje) => {
                  const isSelected = selectedPasajeId === pasaje.id;
                  return (
                    <button
                      key={pasaje.id}
                      onClick={() => setSelectedPasajeId(pasaje.id)}
                      className={`
                        p-2 rounded-lg text-center text-sm font-medium transition duration-200
                        ${
                          isSelected
                            ? "bg-green-500 text-white shadow-md"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }
                        border-2 border-green-500
                      `}
                    >
                      {pasaje.asiento}
                      <span className="block text-xs font-bold mt-1">
                        ${pasaje.precio}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 pt-4 border-t flex justify-end">
        <button
          onClick={handleComprar}
          disabled={!selectedPasajeId || clases.length === 0}
          className={`
            px-6 py-3 rounded-xl font-bold text-lg transition duration-300
            ${
              selectedPasajeId && clases.length > 0
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          Pagar y Confirmar Compra
        </button>
      </div>
    </div>
  );
}
