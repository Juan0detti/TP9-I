import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Alertas() {
  const [vuelosEnAlerta, setVuelosEnAlerta] = useState([]); // Almacena los vuelos demorados/cancelados
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay token, redirigir al usuario (opcional, pero buena práctica si el dashboard es privado)
    if (!token) {
      // navigate('/login');
      setLoading(false);
      return;
    }
    fetchVuelosAlertas();
  }, [token, navigate]);

  // ➡️ FUNCIÓN PARA CARGAR Y FILTRAR VUELOS CON ALERTA
  const fetchVuelosAlertas = async () => {
    setLoading(true);
    try {
      // 1. Obtener todos los vuelos (usando el endpoint ya existente)
      const res = await fetch("http://localhost:3000/api/v1/vuelos", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener los vuelos.");

      const todosVuelos = await res.json();

      // 2. Filtrado Lógico: Buscamos estados 'Atrasado' o 'Cancelado'
      const vuelosFiltrados = todosVuelos.filter(
        (v) => v.estado === "Atrasado" || v.estado === "Cancelado"
      );

      setVuelosEnAlerta(vuelosFiltrados);
    } catch (error) {
      console.error("❌ Error al cargar alertas de vuelos:", error);
      setVuelosEnAlerta([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para determinar la clase de estilo (ej. Tailwind CSS) basada en el estado del vuelo
  const getAlertStyle = (estado) => {
    switch (estado) {
      case "Cancelado":
        return "bg-red-200 text-red-900 border-red-700";
      case "Atrasado":
        return "bg-orange-100 text-orange-800 border-orange-500";
      default:
        return "bg-blue-100 text-blue-800 border-blue-500";
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-xl text-center">
        <h2 className="text-3xl font-bold mb-6 text-sky-700">
          Alertas de Vuelos
        </h2>

        <div className="bg-white p-6 rounded-2xl shadow-xl">
          {loading ? (
            <p className="text-gray-500">Cargando alertas de vuelos...</p>
          ) : vuelosEnAlerta.length === 0 ? (
            // Mensaje si no hay problemas
            <p className="text-green-600 font-medium">
              ✅ No hay vuelos atrasados ni cancelados en este momento.
            </p>
          ) : (
            // Lista de vuelos con problemas
            <ul className="space-y-4 text-left">
              <h3 className="text-xl font-semibold mb-3 text-red-700">
                {vuelosEnAlerta.length} Vuelo(s) Afectado(s)
              </h3>
              {vuelosEnAlerta.map((vuelo) => (
                <li
                  key={vuelo.id}
                  className={`p-4 border-l-4 rounded-md ${getAlertStyle(
                    vuelo.estado
                  )}`}
                >
                  <div className="font-bold uppercase text-sm mb-1">
                    {vuelo.estado === "Cancelado"
                      ? "❌ CANCELADO"
                      : "⚠️ ATRASADO"}
                  </div>
                  <p className="text-gray-900 font-semibold">
                    Vuelo {vuelo.origen} → {vuelo.destino}
                  </p>
                  <p className="text-sm mt-1 text-gray-700">
                    Fecha programada:{" "}
                    {new Date(vuelo.fecha_salida).toLocaleDateString()}
                  </p>
                  {vuelo.estado === "Atrasado" && (
                    <p className="text-sm mt-1 text-gray-700 font-medium">
                      Consulte la hora de llegada estimada.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
