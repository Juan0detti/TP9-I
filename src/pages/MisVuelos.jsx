import React, { useEffect, useState } from "react";

export default function MisVuelos() {
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVuelos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/v1/pasajes/mis", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener los vuelos");

        const data = await res.json();
        setVuelos(data);
      } catch (error) {
        console.error("Error al cargar los vuelos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVuelos();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando vuelos...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mis Vuelos</h2>
      <table className="w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-sky-100">
            <th className="p-2">#</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Salida</th>
            <th>Asiento</th>
            <th>Clase</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {vuelos.length > 0 ? (
            vuelos.map((vuelo, i) => (
              <tr key={vuelo.id} className="border-t hover:bg-gray-50">
                <td className="p-2 text-center">{i + 1}</td>
                <td>{vuelo.origen}</td>
                <td>{vuelo.destino}</td>
                <td>{new Date(vuelo.fecha_salida).toLocaleString()}</td>
                <td className="text-center">{vuelo.asiento}</td>
                <td className="text-center capitalize">{vuelo.tipo_asiento}</td>
                <td className="text-center">${vuelo.precio_pagado}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-3 text-center text-gray-500">
                No hay vuelos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
