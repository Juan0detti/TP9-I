import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const links = [
    { path: "/pasajero/dashboard", label: "Dashboard" },
    { path: "/pasajero/vuelos", label: "Mis Vuelos" },
    { path: "/pasajero/itinerarios", label: "Itinerarios" },
    { path: "/pasajero/alertas", label: "Alertas" },
    { path: "/pasajero/destinos", label: "Destinos" },
    { path: "/pasajero/perfil", label: "Perfil" },
  ];

  return (
    <aside className="h-screen w-60 bg-sky-700 text-white flex flex-col p-4 space-y-3">
      <h1 className="text-2xl font-bold mb-4">
        <p>Vuelos</p>
        <p>App</p>
        <p>✈️</p>
      </h1>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`p-2 rounded-md hover:bg-sky-600 ${
            location.pathname === link.path ? "bg-sky-600" : ""
          }`}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
