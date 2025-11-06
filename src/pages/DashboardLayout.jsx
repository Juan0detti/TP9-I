// Archivo: src/layouts/DashboardLayout.jsx (NUEVO)

import React from "react";
import { Outlet } from "react-router-dom";

// 1. Importamos TU componente Sidebar
// (Ajusta la ruta si 'Sidebar.jsx' no está en '../Sidebar')
import Sidebar from "../Sidebar"; 

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      
      {/* --- Tu Barra Lateral --- */}
      <Sidebar />
      {/* ------------------------- */}
      
      <main className="flex-grow p-6 bg-gray-100 text-gray-900 overflow-auto">
        {/* Aquí se renderizarán las páginas (Dashboard, Perfil, etc.) */}
        <Outlet />
      </main>
    </div>
  );
}