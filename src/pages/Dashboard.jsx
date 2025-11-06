import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [vuelos, setVuelos] = useState([]);
  const [misVuelos, setMisVuelos] = useState([]);
  const [alertasVuelos, setAlertasVuelos] = useState([]); // ⬅️ Nuevo estado para alertas
  const [filtros, setFiltros] = useState({
    origen: "",
    destino: "",
    minPrecio: "",
    maxPrecio: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVuelos();
    fetchVuelosAlertas(); // ⬅️ Obtener vuelos en alerta
    if (token) fetchMisVuelos();
  }, [token]);

  // FUNCIÓN PARA OBTENER TODOS LOS VUELOS (se usa para la tabla y las alertas)
  const fetchVuelos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/vuelos", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener los vuelos");
      const data = await res.json();
      setVuelos(data);
      // ⬅️ Llamamos al filtro de alertas inmediatamente después de obtener los datos
      setAlertasVuelos(
        data.filter((v) => v.estado === "Atrasado" || v.estado === "Cancelado")
      );
    } catch (error) {
      console.error("❌ Error al obtener vuelos disponibles:", error);
    }
  };

  // ⬅️ Función ahora simple, solo llama a fetchVuelos y setea las alertas
  const fetchVuelosAlertas = () => {
    // La lógica de fetching y filtrado está ahora en fetchVuelos
    // Esta función actúa como un simple disparador en el useEffect
  };

  const fetchMisVuelos = async () => {
    try {
      if (!token) return;

      const res = await fetch(`http://localhost:3000/api/v1/pasajes/mis`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(`Error ${res.status} al obtener mis pasajes.`);
        throw new Error(`Error ${res.status} al obtener los pasajes.`);
      }

      const data = await res.json();
      setMisVuelos(data);
    } catch (error) {
      console.error("❌ Error al obtener mis pasajes:", error);
    }
  };

  const handleFiltrar = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSelectVuelo = (vueloId) => {
    navigate(`/comprar-pasajes/${vueloId}`);
  };

  const vuelosFiltrados = vuelos.filter((v) => {
    const precio = parseFloat(v.precio);
    const fechaSalida = new Date(v.fecha_salida).getTime();

    const filtroOrigen = filtros.origen ? v.origen === filtros.origen : true;
    const filtroDestino = filtros.destino
      ? v.destino === filtros.destino
      : true;

    const minP = parseFloat(filtros.minPrecio);
    const maxP = parseFloat(filtros.maxPrecio);
    const filtroPrecio =
      (isNaN(minP) || precio >= minP) && (isNaN(maxP) || precio <= maxP);

    const inicioF = filtros.fechaInicio
      ? new Date(filtros.fechaInicio).getTime()
      : 0;
    const finF = filtros.fechaFin
      ? new Date(filtros.fechaFin).getTime()
      : Infinity;
    const filtroFecha = fechaSalida >= inicioF && fechaSalida <= finF;

    return filtroOrigen && filtroDestino && filtroPrecio && filtroFecha;
  });

  const origenes = [...new Set(vuelos.map((v) => v.origen))];
  const destinos = [...new Set(vuelos.map((v) => v.destino))];

  return (
    <div>
      {/* Título */}
      <h1 className="text-4xl font-extrabold text-sky-700 mb-6">
        Bienvenido, {usuario?.nombre || "Usuario"} ✈️
      </h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mis vuelos (Pasajes comprados) */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-3">🧳 Mis Pasajes</h3>
          {misVuelos.length === 0 ? (
            <p className="text-gray-500">No tienes pasajes registrados.</p>
          ) : (
            <ul className="space-y-3">
              {misVuelos.map((pasaje) => (
                <li key={pasaje.id} className="border-b pb-2 pt-1">
                  <p className="font-semibold text-sky-700">
                    Asiento: {pasaje.asiento || "N/A"} (
                    {pasaje.tipo_asiento || "N/A"})
                  </p>
                  <p className="text-sm text-gray-700">
                    Vuelo: {pasaje.origen} → {pasaje.destino}
                  </p>
                  <p className="text-sm text-gray-700">
                    Fecha: {new Date(pasaje.fecha_salida).toLocaleDateString()}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    Precio Pagado: ${pasaje.precio_pagado || pasaje.precio}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🚨 Últimas alertas (Contenido Dinámico) 🚨 */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-3">🚨 Últimas alertas</h3>
          <ul className="text-gray-600 space-y-2">
            {alertasVuelos.length === 0 ? (
              <li className="text-green-600 font-medium">
                ✅ Todo en orden. No hay atrasos ni cancelaciones.
              </li>
            ) : (
              alertasVuelos.map((v) => (
                <li
                  key={v.id}
                  className={`font-semibold ${
                    v.estado === "Cancelado"
                      ? "text-red-600"
                      : "text-orange-600"
                  }`}
                >
                  {v.estado === "Cancelado" ? "❌ CANCELADO" : "⚠️ ATRAZADO"}{" "}
                  Vuelo {v.origen} → {v.destino}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Vuelos disponibles */}
      <div className="mt-10 bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-semibold mb-4">✈️ Vuelos disponibles</h3>
        {vuelos.length === 0 ? (
          <p className="text-gray-500">No hay vuelos disponibles.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-sky-100">
                <tr>
                  {/* Filtros de Origen, Destino, Fecha y Precio */}
                  <th className="py-2 px-4 text-left">
                    <select
                      className="bg-sky-50 border border-gray-300 rounded px-2 py-1"
                      value={filtros.origen}
                      onChange={(e) => handleFiltrar("origen", e.target.value)}
                    >
                      <option value="">Origen</option>
                      {origenes.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th className="py-2 px-4 text-left">
                    <select
                      className="bg-sky-50 border border-gray-300 rounded px-2 py-1"
                      value={filtros.destino}
                      onChange={(e) => handleFiltrar("destino", e.target.value)}
                    >
                      <option value="">Destino</option>
                      {destinos.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th className="py-2 px-4 text-left">
                    <label className="text-xs font-normal block mb-1">
                      Fecha inicio
                    </label>
                    <input
                      type="date"
                      className="bg-sky-50 border border-gray-300 rounded px-2 py-1 w-full text-sm"
                      value={filtros.fechaInicio}
                      onChange={(e) =>
                        handleFiltrar("fechaInicio", e.target.value)
                      }
                    />
                    <label className="text-xs font-normal block mt-2 mb-1">
                      Fecha fin
                    </label>
                    <input
                      type="date"
                      className="bg-sky-50 border border-gray-300 rounded px-2 py-1 w-full text-sm"
                      value={filtros.fechaFin}
                      onChange={(e) =>
                        handleFiltrar("fechaFin", e.target.value)
                      }
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {vuelosFiltrados.map((vuelo) => (
                  <tr
                    key={vuelo.id}
                    onClick={() => handleSelectVuelo(vuelo.id)}
                    className="border-t hover:bg-sky-50 cursor-pointer transition duration-150"
                  >
                    {/* Columnas de Datos */}
                    <td className="py-2 px-4">{vuelo.origen}</td>
                    <td className="py-2 px-4">{vuelo.destino}</td>
                    <td className="py-2 px-4">
                      {new Date(vuelo.fecha_salida).toLocaleDateString()}
                    </td>
                    {/* Columna de Acción */}
                    <td className="py-2 px-4 font-semibold text-sky-600">
                      Ver Pasajes ➡️
                    </td>
                  </tr>
                ))}
                {vuelosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      No se encontraron vuelos con esos filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
