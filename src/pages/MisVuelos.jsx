import React from "react";

export default function MisVuelos() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mis Vuelos</h2>
      <table className="w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-sky-100">
            <th className="p-2">Número</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Salida</th>
            <th>Llegada</th>
            <th>Clase</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="7" className="p-3 text-center text-gray-500">
              No hay vuelos registrados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
